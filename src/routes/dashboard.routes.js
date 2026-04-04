const express = require('express');
const { query } = require('express-validator');
const DashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get financial summary statistics
 * @access  Private - All authenticated users
 */
router.get(
    '/summary',
    [
        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Start date must be a valid date'),
        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('End date must be a valid date')
    ],
    handleValidationErrors,
    DashboardController.getSummary
);

/**
 * @route   GET /api/dashboard/category-breakdown
 * @desc    Get category-wise breakdown
 * @access  Private - All authenticated users
 */
router.get(
    '/category-breakdown',
    [
        query('type')
            .optional()
            .isIn(['income', 'expense'])
            .withMessage('Type must be income or expense'),
        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Start date must be a valid date'),
        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('End date must be a valid date')
    ],
    handleValidationErrors,
    DashboardController.getCategoryBreakdown
);

/**
 * @route   GET /api/dashboard/recent-activity
 * @desc    Get recent financial activity
 * @access  Private - All authenticated users
 */
router.get(
    '/recent-activity',
    [
        query('limit')
            .optional()
            .isInt({ min: 1, max: 50 })
            .withMessage('Limit must be between 1 and 50')
    ],
    handleValidationErrors,
    DashboardController.getRecentActivity
);

/**
 * @route   GET /api/dashboard/monthly-trends
 * @desc    Get monthly income/expense trends
 * @access  Private - All authenticated users
 */
router.get(
    '/monthly-trends',
    [
        query('months')
            .optional()
            .isInt({ min: 1, max: 24 })
            .withMessage('Months must be between 1 and 24')
    ],
    handleValidationErrors,
    DashboardController.getMonthlyTrends
);

/**
 * @route   GET /api/dashboard
 * @desc    Get complete dashboard data
 * @access  Private - All authenticated users
 */
router.get(
    '/',
    [
        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Start date must be a valid date'),
        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('End date must be a valid date')
    ],
    handleValidationErrors,
    DashboardController.getDashboardData
);

module.exports = router;