const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Create a new user
     */
    static async create({ name, email, password, role = 'viewer', status = 'active' }) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
      INSERT INTO tbl_users (name, email, password, role, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id AS user_id, name, email, role, status, created_at
    `;

        const values = [name, email, hashedPassword, role, status];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    /**
     * Find user by ID
     */
    static async findById(id) {
        const query = 'SELECT id AS user_id, name, email, role, status, created_at, updated_at FROM tbl_users WHERE id = $1';
        const result = await db.query(query, [id]);

        return result.rows[0];
    }

    /**
     * Find user by email (includes password for authentication)
     */
    static async findByEmail(email) {
        const query = 'SELECT * FROM tbl_users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    /**
     * Get all users with pagination
     */
    static async findAll({ page = 1, limit = 10, role = null, status = null }) {
        const offset = (page - 1) * limit;
        let query = 'SELECT id AS user_id, name, email, role, status, created_at FROM tbl_users WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) FROM tbl_users WHERE 1=1';
        const values = [];
        let paramCount = 1;

        // Add filters
        if (role) {
            query += ` AND role = $${paramCount}`;
            countQuery += ` AND role = $${paramCount}`;
            values.push(role);
            paramCount++;
        }

        if (status) {
            query += ` AND status = $${paramCount}`;
            countQuery += ` AND status = $${paramCount}`;
            values.push(status);
            paramCount++;
        }

        // Add pagination
        query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;

        const [users, count] = await Promise.all([
            db.query(query, [...values, limit, offset]),
            db.query(countQuery, values)
        ]);

        return {
            users: users.rows,
            total: parseInt(count.rows[0].count),
            page,
            limit,
            totalPages: Math.ceil(count.rows[0].count / limit)
        };
    }

    /**
     * Update user
     */
    static async update(id, updates) {
        const allowedFields = ['name', 'email', 'role', 'status'];
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = $${paramCount}`);
                values.push(updates[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }

        values.push(id);
        const query = `
      UPDATE tbl_users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, role, status, updated_at
    `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Delete user
     */
    static async delete(id) {
        const query = 'DELETE FROM tbl_users WHERE id = $1 RETURNING id';
        const result = await db.query(query, [id]);

        return result.rows[0];
    }

    /**
     * Verify password
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;