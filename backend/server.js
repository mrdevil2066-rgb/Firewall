require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const connectDB = require('./config/database');
const winston = require('winston');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3001';

const app = express();

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        ...(process.env.NODE_ENV !== 'production' ? [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' })
        ] : [])
    ]
});

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Routes
app.use('/api/attacks', require('./routes/attacks'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/firewall', require('./routes/firewall'));

// Target server proxy routes
app.get('/api/target/status', async (req, res) => {
    try {
        const response = await axios.get(`${TARGET_URL}/api/status`, { timeout: 3000 });
        res.json(response.data);
    } catch {
        res.status(503).json({ error: 'Target server offline', online: false });
    }
});

app.post('/api/target/reset', async (req, res) => {
    try {
        const response = await axios.post(`${TARGET_URL}/api/reset`, {}, { timeout: 3000 });
        res.json(response.data);
    } catch {
        res.status(503).json({ error: 'Target server offline' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Firewall Educational Platform API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`🛡️  Firewall Educational Platform API`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
