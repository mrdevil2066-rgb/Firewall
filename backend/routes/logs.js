const express = require('express');
const router = express.Router();
const AttackLog = require('../models/AttackLog');

// Get all attack logs with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const logs = await AttackLog.find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip(skip);

        const total = await AttackLog.countDocuments();

        res.json({
            success: true,
            logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get attack statistics
router.get('/stats', async (req, res) => {
    try {
        // Total attacks
        const totalAttacks = await AttackLog.countDocuments();

        // Blocked vs allowed
        const blockedCount = await AttackLog.countDocuments({ blocked: true });
        const allowedCount = totalAttacks - blockedCount;

        // Attacks by type
        const attacksByType = await AttackLog.aggregate([
            {
                $group: {
                    _id: '$attackType',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Attacks by severity
        const attacksBySeverity = await AttackLog.aggregate([
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Recent attacks (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentAttacks = await AttackLog.countDocuments({
            timestamp: { $gte: oneDayAgo }
        });

        // Attack trend (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const attackTrend = await AttackLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({
            success: true,
            stats: {
                totalAttacks,
                blockedCount,
                allowedCount,
                recentAttacks,
                attacksByType: attacksByType.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                attacksBySeverity: attacksBySeverity.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                attackTrend
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Clear all logs
router.delete('/', async (req, res) => {
    try {
        await AttackLog.deleteMany({});
        res.json({
            success: true,
            message: 'All logs cleared successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
