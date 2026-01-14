/**
 * Demo Express Application
 * 
 * Express server application demonstrating qtests integration
 * with security middleware, logging, and API routes.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const winston = require('winston');
const qerrors = require('qerrors');
const path = require('path');

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            silent: false
        })
    ]
});

// Create Express application
const app = express();

// Security middleware with Helmet
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    } : false,
    hsts: process.env.NODE_ENV === 'production' ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    } : false
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://yourdomain.com'])
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parser with error handling
app.use(express.json({
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf.toString());
        } catch (error) {
            qerrors(error, 'express.json: parsing request body', {
                url: req.url,
                method: req.method
            });
            throw error;
        }
    }
}));

// Request logging middleware
app.use((req, _res, next) => {
    try {
        logger.info(`REQ ${req.method} ${req.url}`);
    } catch (e) {
        // Ignore logging errors
    }
    next();
});

// Import route handlers
const helloRouter = require('./routes/hello');
const calculatorRouter = require('./routes/calculator');
const statusRouter = require('./routes/status');
const rootRouter = require('./routes/root');
const usersRouter = require('./routes/users');

// Register routes
app.use('/api', helloRouter);
app.use('/api', calculatorRouter);
app.use('/api', statusRouter);
app.use('/api', usersRouter);
app.use('/', rootRouter);

// Serve demo.html at root with no-cache headers
app.get('/', (_req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.sendFile(path.join(__dirname, '..', 'demo.html'));
});

// Health check endpoints
app.get('/health', (_req, res) => 
    res.status(200).json({ ok: true })
);

app.get('/api/health', (_req, res) => 
    res.status(200).json({ 
        ok: true, 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    })
);

// Global error handler
app.use((error, req, res, next) => {
    qerrors(error, 'express.global: unhandled error', {
        url: req.url,
        method: req.method
    });
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;