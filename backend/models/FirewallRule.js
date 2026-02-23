const mongoose = require('mongoose');

const firewallRuleSchema = new mongoose.Schema({
    ruleName: {
        type: String,
        required: true,
        unique: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    attackType: {
        type: String,
        required: true
    },
    sensitivity: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    description: {
        type: String,
        default: ''
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FirewallRule', firewallRuleSchema);
