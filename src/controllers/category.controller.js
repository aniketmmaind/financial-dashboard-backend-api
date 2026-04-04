const CategoryService = require('../services/category.service');
const { success } = require('../utils/response');

class CategoryController {
    /**
     * Get Categories
     * All authenticated user access this
     */
    static async getCategory(req, res, next) {
        try {

            const categories = await CategoryService.getCategories();

            return success(res, categories, 'Categories Retrived Successfully..');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create New Category
     * Only admin can create new categories
     */
    static async createNewCategory(req, res, next) {
        try {
            const { type } = req.body;

            const newCategory = await CategoryService.createCategories({ type });

            return success(res, newCategory, 'New Category Created Successfully...');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update Category
     * Only admin can update categories
     */
    static async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { type } = req.body;

            const updatedCategory = await CategoryService.updateCategory({ id, type });

            return success(res, updatedCategory, 'Category Updated Successfully...');
        } catch (err) {
            next(err);
        }
    }

    /**
     * DeleteCategory
     * Only admin can delete categories
     */
    static async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;

            const deletedCategory = await CategoryService.deleteCategory(id);

            return success(res, deletedCategory, 'Category Deleted...');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CategoryController;