const rateLimit = require('express-rate-limit');
const { rateLimitWindowMs, rateLimitMaxRequests } = require('../config/env');

/**
 * General rate limiter for all API endpoints
 */
const apiLimiter = rateLimit({
    windowMs: rateLimitWindowMs, // 15 minutes by default
    max: rateLimitMaxRequests, // 100 requests per window
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Stricter rate limiter for authentication endpoints
 */
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per window
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter
};