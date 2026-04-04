const express = require('express');
const { body, param, query } = require('express-validator');
const RecordController = require('../controllers/record.controller');
const authenticate = require('../middleware/auth');
const { requireMinimumRole } = require('../middleware/validateRole');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

// All record routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/records
 * @desc    Get all financial records with filters (All authenticated users)
 *          Analyst fetch Data Based on their ID to creator_id column                
 * @access  Private - Analyst, Admin
 */
router.get(
    '/',
    requireMinimumRole('analyst'),
    [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        query('type')
            .optional()
            .isIn(['income', 'expense'])
            .withMessage('Type must be income or expense'),
        query('category')
            .optional()
            .trim(),
        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Start date must be a valid date'),
        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('End date must be a valid date'),
        query('search')
            .optional()
            .trim()
    ],
    handleValidationErrors,
    RecordController.getAllRecords
);

/**
 * @route   GET /api/records/:id
 * @desc    Get record by ID (All authenticated users)
 * @access  Private - Analyst, Admin
 */
router.get(
    '/:id',
    requireMinimumRole('analyst'),
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid record ID')
    ],
    handleValidationErrors,
    RecordController.getRecordById
);

/**
 * @route   POST /api/records
 * @desc    Create new financial record For User (Analyst and Admin only)
 * @access  Private - Analyst, Admin
 */
router.post(
    '/',
    requireMinimumRole('analyst'),
    [
        body('userId')
            .notEmpty()
            .withMessage('User Id is required')
            .isFloat({ min: 0.01 })
            .withMessage('User Id must be a positive number'),
        body('amount')
            .notEmpty()
            .withMessage('Amount is required')
            .isFloat({ min: 0.01 })
            .withMessage('Amount must be a positive number'),
        body('type')
            .notEmpty()
            .withMessage('Type is required')
            .isIn(['income', 'expense'])
            .withMessage('Type must be income or expense'),
        body('categoryId')
            .trim()
            .notEmpty()
            .withMessage('Category ID is required')
            .isLength({ min: 1 })
            .withMessage('Category ID must be between 1 to 10'),
        body('date')
            .notEmpty()
            .withMessage('Date is required')
            .isISO8601()
            .withMessage('Date must be a valid date'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description must not exceed 500 characters')
    ],
    handleValidationErrors,
    RecordController.createRecord
);

/**
 * @route   PUT /api/records/:id
 * @desc    Update financial record (Admin only)
 * @access  Private - Admin
 */
router.put(
    '/:id',
    requireMinimumRole('admin'),
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid record ID'),
        body('amount')
            .optional()
            .isFloat({ min: 0.01 })
            .withMessage('Amount must be a positive number'),
        body('type')
            .optional()
            .isIn(['income', 'expense'])
            .withMessage('Type must be income or expense'),
        body('category')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Category must be between 2 and 100 characters'),
        body('date')
            .optional()
            .isISO8601()
            .withMessage('Date must be a valid date'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description must not exceed 500 characters')
    ],
    handleValidationErrors,
    RecordController.updateRecord
);

/**
 * @route   DELETE /api/records/:id
 * @desc    Delete financial record (Admin only - soft delete)
 * @access  Private - Admin
 */
router.delete(
    '/:id',
    requireMinimumRole('admin'),
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid record ID')
    ],
    handleValidationErrors,
    RecordController.deleteRecord
);

module.exports = router;

// tbl_financial_records_category_id_fkey   (category_id) -> (id)   public.tbl_categories