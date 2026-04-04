const db = require('../config/database');
class CategoryModel {

    // ➕ Create Category
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

    // 📥 Get All Categories (default + user-specific)
    static async getCategories() {
        const query = `
            SELECT *
            FROM tbl_categories
            WHERE status = true
            ORDER BY created_at DESC
        `;
        const result = await db.query(query, []);
        return result.rows;
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
            RETURNING *
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = CategoryModel;