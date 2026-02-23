const AttackLog = require('../models/AttackLog');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// In-memory storage for rate limiting and brute force tracking
const requestCounts = new Map();
const loginAttempts = new Map();

// Firewall detection patterns
const SQL_INJECTION_PATTERNS = [
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(\bDELETE\b.*\bFROM\b)/i,
    /(\bUPDATE\b.*\bSET\b)/i,
    /(--|\#|\/\*)/,
    /(\bOR\b.*=.*)/i,
    /('.*OR.*'.*=.*')/i,
    /(\bEXEC\b|\bEXECUTE\b)/i
];

const XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /onclick\s*=/gi,
    /<img\b.*onerror/gi,
    /eval\(/gi,
    /alert\(/gi
];

const PATH_TRAVERSAL_PATTERNS = [
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2e%2f/gi,
    /%2e%2e\\/gi,
    /\.\.%2f/gi
];

// Firewall middleware
const firewallMiddleware = {
    // SQL Injection detection
    detectSQLInjection: (input) => {
        const detectedPatterns = [];
        for (const pattern of SQL_INJECTION_PATTERNS) {
            if (pattern.test(input)) {
                detectedPatterns.push(pattern.toString());
            }
        }
        return {
            detected: detectedPatterns.length > 0,
            patterns: detectedPatterns,
            severity: detectedPatterns.length > 2 ? 'critical' : 'high'
        };
    },

    // XSS detection
    detectXSS: (input) => {
        const detectedPatterns = [];
        for (const pattern of XSS_PATTERNS) {
            if (pattern.test(input)) {
                detectedPatterns.push(pattern.toString());
            }
        }
        return {
            detected: detectedPatterns.length > 0,
            patterns: detectedPatterns,
            severity: detectedPatterns.length > 1 ? 'high' : 'medium'
        };
    },

    // Path Traversal detection
    detectPathTraversal: (input) => {
        const detectedPatterns = [];
        for (const pattern of PATH_TRAVERSAL_PATTERNS) {
            if (pattern.test(input)) {
                detectedPatterns.push(pattern.toString());
            }
        }
        return {
            detected: detectedPatterns.length > 0,
            patterns: detectedPatterns,
            severity: 'high'
        };
    },

    // DDoS detection (rate limiting)
    detectDDoS: (ip, threshold = 10, windowMs = 1000) => {
        const now = Date.now();
        const key = `ddos_${ip}`;

        if (!requestCounts.has(key)) {
            requestCounts.set(key, []);
        }

        const requests = requestCounts.get(key);
        // Remove old requests outside the time window
        const recentRequests = requests.filter(time => now - time < windowMs);
        recentRequests.push(now);
        requestCounts.set(key, recentRequests);

        const isAttack = recentRequests.length > threshold;

        return {
            detected: isAttack,
            requestCount: recentRequests.length,
            threshold,
            severity: isAttack ? 'critical' : 'low'
        };
    },

    // Brute Force detection
    detectBruteForce: (username, maxAttempts = 5, windowMs = 60000) => {
        const now = Date.now();
        const key = `brute_${username}`;

        if (!loginAttempts.has(key)) {
            loginAttempts.set(key, { count: 0, firstAttempt: now, locked: false });
        }

        const attempt = loginAttempts.get(key);

        // Reset if window expired
        if (now - attempt.firstAttempt > windowMs) {
            attempt.count = 0;
            attempt.firstAttempt = now;
            attempt.locked = false;
        }

        attempt.count++;

        if (attempt.count > maxAttempts) {
            attempt.locked = true;
        }

        loginAttempts.set(key, attempt);

        return {
            detected: attempt.locked,
            attemptCount: attempt.count,
            maxAttempts,
            locked: attempt.locked,
            severity: attempt.locked ? 'high' : 'medium'
        };
    },

    // CSRF token validation
    validateCSRFToken: (token, expectedToken) => {
        const isValid = token === expectedToken;
        return {
            detected: !isValid,
            valid: isValid,
            severity: isValid ? 'low' : 'high'
        };
    },

    // Port scanning detection (simulated)
    detectPortScan: (ports, threshold = 5) => {
        const isScanning = ports.length > threshold;
        return {
            detected: isScanning,
            portsScanned: ports.length,
            threshold,
            severity: isScanning ? 'medium' : 'low'
        };
    },

    // MITM detection (certificate validation simulation)
    detectMITM: (certificateValid) => {
        return {
            detected: !certificateValid,
            certificateValid,
            severity: certificateValid ? 'low' : 'critical'
        };
    },

    // Log attack to database
    logAttack: async (attackData) => {
        try {
            const log = new AttackLog(attackData);
            await log.save();
            logger.info(`Attack logged: ${attackData.attackType}`);
            return log;
        } catch (error) {
            logger.error(`Error logging attack: ${error.message}`);
            throw error;
        }
    },

    // Sanitize SQL input
    sanitizeSQL: (input) => {
        return input
            .replace(/'/g, "''")
            .replace(/;/g, '')
            .replace(/--/g, '')
            .replace(/\/\*/g, '')
            .replace(/\*\//g, '');
    },

    // Sanitize XSS input
    sanitizeXSS: (input) => {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    // Sanitize path
    sanitizePath: (input) => {
        return input
            .replace(/\.\.\//g, '')
            .replace(/\.\.\\/g, '')
            .replace(/%2e%2e%2f/gi, '')
            .replace(/%2e%2e\\/gi, '');
    }
};

module.exports = firewallMiddleware;
