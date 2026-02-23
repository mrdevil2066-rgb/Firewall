const express = require('express');
const router = express.Router();
const FirewallRule = require('../models/FirewallRule');

// Initialize default firewall rules
const initializeRules = async () => {
    const defaultRules = [
        { ruleName: 'SQL Injection Protection', attackType: 'sql-injection', enabled: true, sensitivity: 7, description: 'Detects and blocks SQL injection attempts' },
        { ruleName: 'XSS Protection', attackType: 'xss', enabled: true, sensitivity: 8, description: 'Detects and blocks cross-site scripting attacks' },
        { ruleName: 'DDoS Protection', attackType: 'ddos', enabled: true, sensitivity: 6, description: 'Rate limiting to prevent DDoS attacks' },
        { ruleName: 'Brute Force Protection', attackType: 'brute-force', enabled: true, sensitivity: 5, description: 'Detects and blocks brute force login attempts' },
        { ruleName: 'CSRF Protection', attackType: 'csrf', enabled: true, sensitivity: 9, description: 'Validates CSRF tokens on requests' },
        { ruleName: 'MITM Protection', attackType: 'mitm', enabled: true, sensitivity: 10, description: 'SSL certificate validation' },
        { ruleName: 'Port Scan Protection', attackType: 'port-scan', enabled: true, sensitivity: 5, description: 'Detects port scanning attempts' },
        { ruleName: 'Path Traversal Protection', attackType: 'path-traversal', enabled: true, sensitivity: 8, description: 'Prevents directory traversal attacks' }
    ];

    for (const rule of defaultRules) {
        await FirewallRule.findOneAndUpdate(
            { ruleName: rule.ruleName },
            rule,
            { upsert: true, new: true }
        );
    }
};

// Get all firewall rules
router.get('/rules', async (req, res) => {
    try {
        // Initialize rules if not exists
        const count = await FirewallRule.countDocuments();
        if (count === 0) {
            await initializeRules();
        }

        const rules = await FirewallRule.find().sort({ attackType: 1 });
        res.json({
            success: true,
            rules
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update firewall rules
router.put('/rules', async (req, res) => {
    try {
        const { rules } = req.body;

        const updatedRules = [];
        for (const rule of rules) {
            const updated = await FirewallRule.findByIdAndUpdate(
                rule._id,
                {
                    enabled: rule.enabled,
                    sensitivity: rule.sensitivity,
                    lastModified: Date.now()
                },
                { new: true }
            );
            updatedRules.push(updated);
        }

        res.json({
            success: true,
            message: 'Firewall rules updated successfully',
            rules: updatedRules
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update single rule
router.put('/rules/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled, sensitivity } = req.body;

        const rule = await FirewallRule.findByIdAndUpdate(
            id,
            {
                enabled,
                sensitivity,
                lastModified: Date.now()
            },
            { new: true }
        );

        if (!rule) {
            return res.status(404).json({ success: false, error: 'Rule not found' });
        }

        res.json({
            success: true,
            message: 'Rule updated successfully',
            rule
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
