const mongoose = require('mongoose');

const attackLogSchema = new mongoose.Schema({
    attackType: {
        type: String,
        required: true,
        enum: [
            'sql-injection',
            'xss',
            'ddos',
            'brute-force',
            'csrf',
            'mitm',
            'port-scan',
            'path-traversal'
        ]
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    blocked: {
        type: Boolean,
        default: false
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    sourceIP: {
        type: String,
        default: '127.0.0.1'
    },
    targetEndpoint: {
        type: String,
        default: ''
    },
    payload: {
        type: String,
        default: ''
    },
    detectionRules: [{
        type: String
    }]
});

// Index for faster queries
attackLogSchema.index({ timestamp: -1 });
attackLogSchema.index({ attackType: 1 });
attackLogSchema.index({ blocked: 1 });

module.exports = mongoose.model('AttackLog', attackLogSchema);
