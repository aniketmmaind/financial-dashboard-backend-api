const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
    authLimiter,
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2 })
            .withMessage('Name must be at least 2 characters'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Must be a valid email'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('role')
            .optional()
            .isIn(['viewer', 'analyst', 'admin'])
            .withMessage('Role must be viewer, analyst, or admin')
    ],
    handleValidationErrors,
    AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    authLimiter,
    [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Must be a valid email'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    handleValidationErrors,
    AuthController.login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
    '/profile',
    authenticate,
    AuthController.getProfile
);

module.exports = router;