const express = require('express');
const { body, param, query } = require('express-validator');
const UserController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth');
const { requireRole } = require('../middleware/validateRole');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private - Admin
 */
router.get(
    '/',
    requireRole('admin'),
    [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        query('role')
            .optional()
            .isIn(['viewer', 'analyst', 'admin'])
            .withMessage('Invalid role'),
        query('status')
            .optional()
            .isIn(['active', 'inactive'])
            .withMessage('Status must be active or inactive')
    ],
    handleValidationErrors,
    UserController.getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (Admin only)
 * @access  Private - Admin
 */
router.get(
    '/:id',
    requireRole('admin'),
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid user ID')
    ],
    handleValidationErrors,
    UserController.getUserById
);

/**
 * @route   POST /api/users
 * @desc    Create new user (Admin only)
 * @access  Private - Admin
 */
router.post(
    '/',
    requireRole('admin'),
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
            .notEmpty()
            .withMessage('Role is required')
            .isIn(['viewer', 'analyst', 'admin'])
            .withMessage('Role must be viewer, analyst, or admin'),
        body('status')
            .optional()
            .isIn(['active', 'inactive'])
            .withMessage('Status must be active or inactive')
    ],
    handleValidationErrors,
    UserController.createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user (Admin only)
 * @access  Private - Admin
 */
router.put(
    '/:id',
    requireRole('admin'),
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid user ID'),
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2 })
            .withMessage('Name must be at least 2 characters'),
        body('email')
            .optional()
            .trim()
            .isEmail()
            .withMessage('Must be a valid email'),
        body('role')
            .optional()
            .isIn(['viewer', 'analyst', 'admin'])
            .withMessage('Role must be viewer, analyst, or admin'),
        body('status')
            .optional()
            .isIn(['active', 'inactive'])
            .withMessage('Status must be active or inactive')
    ],
    handleValidationErrors,
    UserController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private - Admin
 */
router.delete(
    '/:id',
    requireRole('admin'),
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid user ID')
    ],
    handleValidationErrors,
    UserController.deleteUser
);

module.exports = router;