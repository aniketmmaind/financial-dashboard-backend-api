const express = require('express');
const { body, param } = require('express-validator');
const CategoryController = require('../controllers/category.controller');
const authenticate = require('../middleware/auth');

const { requireRole, requireMinimumRole } = require('../middleware/validateRole');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

// All Category routes require authentication
router.use(authenticate);


/**
 * @route   GET /api/category/
 * @desc    Get List of Categories
 * @access  Private - All authenticated users
 */
router.get(
    '/',
    requireMinimumRole('analyst'),
    handleValidationErrors,
    CategoryController.getCategory
);

/**
 * @route   POST /api/category/
 * @desc    Create New Category
 * @access  Only Admin
 */
router.post(
    '/',
    requireRole('admin'),
    [
        body('type').notEmpty()
            .withMessage('Type Required'),
    ],
    handleValidationErrors,
    CategoryController.createNewCategory
);

/**
 * @route   PUT /api/category/:id
 * @desc    Update financial record (Admin only)
 * @access  Private - Admin
 */
router.put(
    '/:id',
    requireRole('admin'),
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid record ID'),
        body('type').notEmpty()
            .withMessage('Type Required'),
    ],
    handleValidationErrors,
    CategoryController.updateCategory
);

/**
 * @route   DELETE /api/category/:id
 * @desc    Delete Category (Admin only)
 * @access  Private - Admin
 */
router.delete(
    '/:id',
    requireRole('admin'),
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid Category ID')
    ],
    handleValidationErrors,
    CategoryController.deleteCategory
);

module.exports = router;