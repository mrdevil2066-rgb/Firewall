const express = require('express');
const router = express.Router();
const axios = require('axios');
const firewall = require('../middleware/firewallRules');

const TARGET_URL = 'http://localhost:3001';

// Helper: Safe axios call to target
async function hitTarget(method, path, params = null, body = null) {
    try {
        const config = { timeout: 5000, validateStatus: () => true };
        let response;
        if (method === 'GET') {
            const url = params
                ? `${TARGET_URL}${path}?${new URLSearchParams(params).toString()}`
                : `${TARGET_URL}${path}`;
            response = await axios.get(url, config);
        } else {
            response = await axios.post(`${TARGET_URL}${path}`, body, config);
        }
        return {
            status: response.status,
            data: response.data,
            url: method === 'GET' && params
                ? `${TARGET_URL}${path}?${new URLSearchParams(params).toString()}`
                : `${TARGET_URL}${path}`,
            method
        };
    } catch (err) {
        return {
            status: 0,
            data: { error: 'Target server unreachable. Is it running on port 3001?' },
            url: `${TARGET_URL}${path}`,
            method,
            offline: true
        };
    }
}

// ─────────────────────────────────────────────
// SQL Injection
// ─────────────────────────────────────────────
router.post('/sql-injection', async (req, res) => {
    try {
        const { query } = req.body;
        const detection = firewall.detectSQLInjection(query);

        await firewall.logAttack({
            attackType: 'sql-injection',
            severity: detection.severity,
            blocked: detection.detected,
            payload: query,
            details: {
                detectedPatterns: detection.patterns,
                originalQuery: query,
                sanitizedQuery: firewall.sanitizeSQL(query)
            },
            sourceIP: req.ip || '127.0.0.1',
            targetEndpoint: `${TARGET_URL}/search`,
            detectionRules: detection.patterns
        });

        // Hit the real target server
        const targetResponse = await hitTarget('GET', '/search', { q: query });

        res.json({
            success: true,
            detected: detection.detected,
            blocked: detection.detected,
            severity: detection.severity,
            message: detection.detected
                ? '🚫 SQL Injection attempt detected and blocked by firewall!'
                : '✅ Query appears safe',
            details: {
                originalQuery: query,
                sanitizedQuery: firewall.sanitizeSQL(query),
                detectedPatterns: detection.patterns,
                explanation: detection.detected
                    ? 'The firewall detected malicious SQL patterns in your query.'
                    : 'No malicious SQL patterns detected.'
            },
            targetResponse: {
                ...targetResponse,
                description: detection.detected
                    ? 'Even though blocked by our firewall, here\'s what happened when the payload reached the vulnerable target:'
                    : 'The query was sent to the target server normally.'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─────────────────────────────────────────────
// XSS
// ─────────────────────────────────────────────
router.post('/xss', async (req, res) => {
    try {
        const { input } = req.body;
        const detection = firewall.detectXSS(input);

        await firewall.logAttack({
            attackType: 'xss',
            severity: detection.severity,
            blocked: detection.detected,
            payload: input,
            details: {
                detectedPatterns: detection.patterns,
                originalInput: input,
                sanitizedInput: firewall.sanitizeXSS(input)
            },
            sourceIP: req.ip || '127.0.0.1',
            targetEndpoint: `${TARGET_URL}/comment`,
            detectionRules: detection.patterns
        });

        // Post comment to target (XSS payload goes in raw)
        const targetResponse = await hitTarget('POST', '/comment', null, {
            author: 'attacker',
            content: input
        });

        res.json({
            success: true,
            detected: detection.detected,
            blocked: detection.detected,
            severity: detection.severity,
            message: detection.detected
                ? '🚫 XSS attack detected and blocked by firewall!'
                : '✅ Input appears safe',
            details: {
                originalInput: input,
                sanitizedInput: firewall.sanitizeXSS(input),
                detectedPatterns: detection.patterns,
                explanation: detection.detected
                    ? 'The firewall detected malicious script patterns in your input.'
                    : 'No malicious script patterns detected.'
            },
            targetResponse: {
                ...targetResponse,
                description: 'XSS payload sent to target comment endpoint — see if it was stored:'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─────────────────────────────────────────────
// DDoS
// ─────────────────────────────────────────────
router.post('/ddos', async (req, res) => {
    try {
        const { requestCount } = req.body;
        const ip = req.ip || '127.0.0.1';

        let detection;
        for (let i = 0; i < requestCount; i++) {
            detection = firewall.detectDDoS(ip, 10, 1000);
        }

        await firewall.logAttack({
            attackType: 'ddos',
            severity: detection.severity,
            blocked: detection.detected,
            payload: `${requestCount} requests`,
            details: {
                requestCount: detection.requestCount,
                threshold: detection.threshold,
                timeWindow: '1 second'
            },
            sourceIP: ip,
            targetEndpoint: `${TARGET_URL}/flood`,
            detectionRules: ['Rate limit exceeded']
        });

        // Flood the target server with real requests
        const floodResults = [];
        const floodCount = Math.min(requestCount, 50);
        for (let i = 0; i < floodCount; i++) {
            floodResults.push(hitTarget('POST', '/flood', null, { requestId: i + 1 }));
        }
        const floodResponses = await Promise.all(floodResults);
        const overwhelmed = floodResponses.filter(r => r.status === 503).length;
        const lastResponse = floodResponses[floodResponses.length - 1];

        res.json({
            success: true,
            detected: detection.detected,
            blocked: detection.detected,
            severity: detection.severity,
            message: detection.detected
                ? '🚫 DDoS attack detected! Rate limit exceeded.'
                : '✅ Request rate within normal limits',
            details: {
                requestCount: detection.requestCount,
                threshold: detection.threshold,
                explanation: detection.detected
                    ? `Received ${detection.requestCount} requests, exceeding threshold of ${detection.threshold}.`
                    : 'Request rate is normal.'
            },
            targetResponse: {
                ...lastResponse,
                description: `Sent ${floodCount} real requests to target. ${overwhelmed} were rejected (503 overwhelmed).`,
                overwhelmedCount: overwhelmed,
                totalSent: floodCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─────────────────────────────────────────────
// Brute Force
// ─────────────────────────────────────────────
router.post('/brute-force', async (req, res) => {
    try {
        const { username, attemptCount } = req.body;

        let detection;
        for (let i = 0; i < attemptCount; i++) {
            detection = firewall.detectBruteForce(username, 5, 60000);
        }

        await firewall.logAttack({
            attackType: 'brute-force',
            severity: detection.severity,
            blocked: detection.detected,
            payload: `${attemptCount} login attempts for ${username}`,
            details: {
                username,
                attemptCount: detection.attemptCount,
                maxAttempts: detection.maxAttempts,
                accountLocked: detection.locked
            },
            sourceIP: req.ip || '127.0.0.1',
            targetEndpoint: `${TARGET_URL}/login`,
            detectionRules: detection.locked ? ['Account locked due to excessive attempts'] : []
        });

        // Send real brute force attempts to target
        const loginResults = [];
        const fakePasswords = ['password', '123456', 'admin', 'letmein', 'qwerty', 'abc123', 'monkey', 'master'];
        const attemptsToSend = Math.min(attemptCount, fakePasswords.length);

        for (let i = 0; i < attemptsToSend; i++) {
            loginResults.push(hitTarget('POST', '/login', null, {
                username,
                password: fakePasswords[i]
            }));
        }
        const loginResponses = await Promise.all(loginResults);
        const lastLogin = loginResponses[loginResponses.length - 1];
        const locked = loginResponses.some(r => r.status === 423);

        res.json({
            success: true,
            detected: detection.detected,
            blocked: detection.detected,
            severity: detection.severity,
            message: detection.detected
                ? '🚫 Brute force attack detected! Account locked.'
                : '✅ Login attempts within normal range',
            details: {
                username,
                attemptCount: detection.attemptCount,
                maxAttempts: detection.maxAttempts,
                accountLocked: detection.locked,
                explanation: detection.detected
                    ? `Account locked after ${detection.attemptCount} failed login attempts.`
                    : 'Login attempts are normal.'
            },
            targetResponse: {
                ...lastLogin,
                description: `Sent ${attemptsToSend} real login attempts to target for user '${username}'.`,
                targetAccountLocked: locked,
                totalAttempts: attemptsToSend
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─────────────────────────────────────────────
// CSRF
// ─────────────────────────────────────────────
router.post('/csrf', async (req, res) => {
    try {
        const { token, action } = req.body;
        const expectedToken = 'VALID_CSRF_TOKEN_12345';
        const detection = firewall.validateCSRFToken(token, expectedToken);

        await firewall.logAttack({
            attackType: 'csrf',
            severity: detection.severity,
            blocked: detection.detected,
            payload: `Action: ${action}, Token: ${token}`,
            details: {
                action,
                tokenProvided: token,
                tokenValid: detection.valid,
                expectedToken: 'VALID_CSRF_TOKEN_12345'
            },
            sourceIP: req.ip || '127.0.0.1',
            targetEndpoint: `${TARGET_URL}/api/transfer`,
            detectionRules: detection.detected ? ['Invalid CSRF token'] : []
        });

        // Hit the target's fund transfer endpoint
        const targetResponse = await hitTarget('POST', '/api/transfer', null, {
            fromUser: 'john_doe',
            toUser: 'attacker',
            amount: 500,
            csrfToken: token
        });

        res.json({
            success: true,
            detected: detection.detected,
            blocked: detection.detected,
            severity: detection.severity,
            message: detection.detected
                ? '🚫 CSRF attack detected! Invalid token.'
                : '✅ Valid CSRF token',
            details: {
                action,
                tokenValid: detection.valid,
                explanation: detection.detected
                    ? 'The CSRF token is invalid or missing. Request blocked.'
                    : 'CSRF token is valid. Request allowed.'
            },
            targetResponse: {
                ...targetResponse,
                description: 'Attempted $500 fund transfer on target with provided CSRF token:'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─────────────────────────────────────────────
// MITM
// ─────────────────────────────────────────────
router.post('/mitm', async (req, res) => {
    try {
        const { certificateValid } = req.body;
        const detection = firewall.detectMITM(certificateValid);

        await firewall.logAttack({
            attackType: 'mitm',
            severity: detection.severity,
            blocked: detection.detected,
            payload: `Certificate validation: ${certificateValid}`,
            details: {
                certificateValid: detection.certificateValid,
                sslValidation: certificateValid ? 'Passed' : 'Failed'
            },
            sourceIP: req.ip || '127.0.0.1',
            targetEndpoint: `${TARGET_URL}/api/users`,
            detectionRules: detection.detected ? ['Invalid SSL certificate'] : []
        });

        // Simulate MITM by attempting to intercept target's user data
        const targetResponse = await hitTarget('GET', '/api/users');

        res.json({
            success: true,
            detected: detection.detected,
            blocked: detection.detected,
            severity: detection.severity,
            message: detection.detected
                ? '🚫 MITM attack detected! Invalid SSL certificate.'
                : '✅ SSL certificate is valid',
            details: {
                certificateValid: detection.certificateValid,
                explanation: detection.detected
                    ? 'SSL certificate validation failed. Possible man-in-the-middle attack.'
                    : 'SSL certificate is valid and trusted.'
            },
            targetResponse: {
                ...targetResponse,
                description: detection.detected
                    ? 'Without HTTPS, a MITM attacker would intercept this user data in transit:'
                    : 'Target user data (would be encrypted with valid SSL):'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─────────────────────────────────────────────
// Port Scan
// ─────────────────────────────────────────────
router.post('/port-scan', async (req, res) => {
    try {
        const { ports } = req.body;
        const detection = firewall.detectPortScan(ports, 5);

        await firewall.logAttack({
            attackType: 'port-scan',
            severity: detection.severity,
            blocked: detection.detected,
            payload: `Scanned ports: ${ports.join(', ')}`,
            details: {
                portsScanned: ports,
                portCount: detection.portsScanned,
                threshold: detection.threshold
            },
            sourceIP: req.ip || '127.0.0.1',
            targetEndpoint: `${TARGET_URL} (ports: ${ports.join(', ')})`,
            detectionRules: detection.detected ? ['Excessive port scanning detected'] : []
        });

        // Simulate port scan results against target host
        const knownPorts = {
            3001: { open: true, service: 'HTTP (ShopVictim Target)' },
            5000: { open: true, service: 'HTTP (Firewall Platform API)' },
            5173: { open: true, service: 'HTTP (Vite Dev Server)' },
            22: { open: false, service: 'SSH' },
            21: { open: false, service: 'FTP' },
            3306: { open: false, service: 'MySQL' },
            5432: { open: false, service: 'PostgreSQL' },
            27017: { open: false, service: 'MongoDB' },
            80: { open: false, service: 'HTTP' },
            443: { open: false, service: 'HTTPS' },
            8080: { open: false, service: 'HTTP Alt' },
            8443: { open: false, service: 'HTTPS Alt' },
        };

        const scanResults = ports.map(port => ({
            port,
            ...(knownPorts[port] || { open: false, service: 'Unknown' })
        }));

        const openPorts = scanResults.filter(p => p.open);

        res.json({
            success: true,
            detected: detection.detected,
            blocked: detection.detected,
            severity: detection.severity,
            message: detection.detected
                ? '🚫 Port scanning detected and blocked!'
                : '✅ Normal port access',
            details: {
                portsScanned: ports,
                portCount: detection.portsScanned,
                threshold: detection.threshold,
                explanation: detection.detected
                    ? `Detected scanning of ${detection.portsScanned} ports, exceeding threshold of ${detection.threshold}.`
                    : 'Port access is normal.'
            },
            targetResponse: {
                url: `http://localhost (ports: ${ports.join(', ')})`,
                method: 'PORT_SCAN',
                status: detection.detected ? 403 : 200,
                data: {
                    targetHost: 'localhost',
                    portsScanned: ports.length,
                    openPortsFound: openPorts.length,
                    scanResults,
                    warning: openPorts.length > 0 ? `Found ${openPorts.length} open port(s): ${openPorts.map(p => `${p.port}/${p.service}`).join(', ')}` : 'No open ports found'
                },
                description: `Simulated port scan of target host. Found ${openPorts.length} open port(s).`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─────────────────────────────────────────────
// Path Traversal
// ─────────────────────────────────────────────
router.post('/path-traversal', async (req, res) => {
    try {
        const { path } = req.body;
        const detection = firewall.detectPathTraversal(path);

        await firewall.logAttack({
            attackType: 'path-traversal',
            severity: detection.severity,
            blocked: detection.detected,
            payload: path,
            details: {
                requestedPath: path,
                sanitizedPath: firewall.sanitizePath(path),
                detectedPatterns: detection.patterns
            },
            sourceIP: req.ip || '127.0.0.1',
            targetEndpoint: `${TARGET_URL}/file`,
            detectionRules: detection.patterns
        });

        // Hit the target's file endpoint with the path
        const targetResponse = await hitTarget('GET', '/file', { path });

        res.json({
            success: true,
            detected: detection.detected,
            blocked: detection.detected,
            severity: detection.severity,
            message: detection.detected
                ? '🚫 Path traversal attack detected and blocked!'
                : '✅ Path appears safe',
            details: {
                requestedPath: path,
                sanitizedPath: firewall.sanitizePath(path),
                detectedPatterns: detection.patterns,
                explanation: detection.detected
                    ? 'The firewall detected directory traversal patterns in the path.'
                    : 'No directory traversal patterns detected.'
            },
            targetResponse: {
                ...targetResponse,
                description: 'Real file request sent to target server with the provided path:'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
