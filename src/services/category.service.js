const CategoryModel = require('../models/CategoryModel');

class CategoryService {
    /**
     * Get overall Categories
     */
    static async getCategories(filters) {
        return await CategoryModel.getCategories(filters);
    }

    /**
     * Create category
     */
    static async createCategories(data) {
        return await CategoryModel.createCategory(data);
    }

    /**
     * Get recent activity
     */
    static async updateCategory(data) {
        return await CategoryModel.updateCategory(data);
    }

    /**
     * Get monthly trends
     */
    static async deleteCategory(id) {
        return await CategoryModel.deleteCategory(id);
    }
}

module.exports = CategoryService;