const db = require('../config/database');
class CategoryModel {

    // Create Category
    static async createCategory({ type }) {
        const query = `
            INSERT INTO tbl_categories (category_type)
            VALUES ($1)
            RETURNING *
        `;
        const values = [type];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Get All Categories
    static async getCategories() {
        const query = `
            SELECT id, category_type
                FROM tbl_categories
            WHERE status = true
            ORDER BY id ASC
        `;
        const result = await db.query(query, []);
        return result.rows;
    }

    // to check whether category already exists or not
    static async getCategoriesByName({ type }) {

        const query = `
            SELECT *
            FROM tbl_categories
            WHERE LOWER(category_type) = LOWER($1)
            AND status = true
            ORDER BY created_at DESC
        `;
        const result = await db.query(query, [type]);
        return result.rows[0];
    }

    // Update Category
    static async updateCategory({ id, type }) {
        const query = `
            UPDATE tbl_categories
            SET category_type = $1
            WHERE id = $2
            RETURNING id, category_type, updated_at
        `;
        const values = [type, id];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    //  Soft Delete Category
    static async deleteCategory(id, userId) {
        const query = `
            UPDATE tbl_categories
            SET status = false
            WHERE id = $1
            RETURNING id
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = CategoryModel;