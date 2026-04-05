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

        //Check whether Category is already exists or not
        const existCategory = await CategoryModel.getCategoriesByName(data);

        if (existCategory) {
            throw { statusCode: 409, message: 'Category already exists with this type.' }
        }

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