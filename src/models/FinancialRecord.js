const db = require('../config/database');

class FinancialRecord {
    /**
     * Create a new financial record
     */
    static async create({ userId, creatorId, amount, type, categoryId, date, description }) {

        const query = `
      INSERT INTO tbl_financial_records (user_id,creator_id, amount, type, category_id, date, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id AS record_id, user_id, creator_id, category_id, amount,
        type, date, description, created_at, updated_at
    `;

        const values = [userId, creatorId, amount, type, categoryId, date, description || null];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    /**
     * Find record by ID
     */
    static async findById(id) {
        const query = `SELECT 
                        t1.id AS record_id, 
                        t3.name AS user_name, 
                        t5.name AS created_by, 
                        t5.role AS creator_role,
                        t1.amount::FLOAT AS amount, 
                        t1.type, 
                        t2.category_type, 
                        t1.date, 
                        t1.description
                    FROM tbl_financial_records t1
                    JOIN tbl_categories t2 ON t1.category_id = t2.id
                    JOIN tbl_users t3 ON t3.id = t1.user_id
                    LEFT JOIN tbl_users t5 ON t5.id = t1.creator_id 
                    WHERE t1.id=$1 AND
                          t1.is_deleted = false`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Get all records with filters and pagination
     * Role-based access: Viewers see only their records, Analysts/Admins see all
     */
    static async findAll({
        page = 1,
        limit = 10,
        type = null,
        category = null,
        startDate = null,
        endDate = null,
        search = null,
    }) {
        const offset = (page - 1) * limit;
        let query = `SELECT 
                        t1.id AS record_id, 
                        t3.name AS user_name, 
                        t5.name AS created_by,
                        t1.amount::FLOAT AS amount, 
                        t1.type, 
                        t2.category_type, 
                        t1.date, 
                        t1.description
                    FROM tbl_financial_records t1
                    JOIN tbl_categories t2 ON t1.category_id = t2.id
                    JOIN tbl_users t3 ON t3.id = t1.user_id
                    LEFT JOIN tbl_users t5 ON t5.id = t1.creator_id 
                    WHERE t1.is_deleted = false`;
        let countQuery = 'SELECT COUNT(t1.*) FROM tbl_financial_records t1, tbl_categories t2 WHERE is_deleted = false';
        const values = [];
        let paramCount = 1;


        // filters
        if (type) {
            query += ` AND t1.type = $${paramCount}`;
            countQuery += ` AND t1.type = $${paramCount}`;
            values.push(type);
            paramCount++;
        }

        if (category) {
            query += ` AND t2.category_type = $${paramCount}`;
            countQuery += ` AND t2.category_type = $${paramCount}`;
            values.push(category);
            paramCount++;
        }

        if (startDate) {
            query += ` AND t1.date >= $${paramCount}`;
            countQuery += ` AND t1.date >= $${paramCount}`;
            values.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND t1.date <= $${paramCount}`;
            countQuery += ` AND t1.date <= $${paramCount}`;
            values.push(endDate);
            paramCount++;
        }

        if (search) {
            query += ` AND (t1.description ILIKE $${paramCount} OR t2.category_type ILIKE $${paramCount})`;
            countQuery += ` AND (t1.description ILIKE $${paramCount} OR t2.category_type ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        // Pagination Added
        query += ` ORDER BY date DESC, t1.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        const [records, count] = await Promise.all([
            db.query(query, [...values, limit, offset]),
            db.query(countQuery, values)
        ]);

        return {
            records: records.rows,
            total: parseInt(count.rows[0].count),
            page,
            limit,
            totalPages: Math.ceil(count.rows[0].count / limit)
        };
    }

    /**
     * Update record
     */
    static async update(id, updates) {
        const allowedFields = ['amount', 'type', 'categoryId', 'date', 'description'];
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key) && updates[key] !== undefined) {
                (key === "categoryId") ?
                    fields.push(`category_id = $${paramCount}`) :
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
      UPDATE tbl_financial_records 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND is_deleted = false
      RETURNING id AS record_id, user_id, creator_id, category_id,
          amount, type, date, description, created_at, updated_at
    `;
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Soft delete record
     */
    static async softDelete(id) {
        const query = `
      UPDATE tbl_financial_records 
      SET is_deleted = true 
      WHERE id = $1 AND is_deleted = false
      RETURNING id
    `;

        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Hard delete record (admin only)
     */
    static async hardDelete(id) {
        const query = 'DELETE FROM tbl_financial_records WHERE id = $1 RETURNING id';
        const result = await db.query(query, [id]);

        return result.rows[0];
    }

    /**
     * Get summary statistics
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getSummary({ startDate = null, endDate = null, userId = null, userRole = null }) {
        let query = `
        SELECT 
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),0) as total_income,     
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),0) as total_expenses,  
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END),0) as net_balance,
            COUNT(*) as total_transactions
        FROM tbl_financial_records 
        WHERE is_deleted = false
    `;

        const values = [];
        let paramCount = 1;

        // Role-based filtering
        if (userRole === 'viewer' && userId) {
            query += ` AND user_id = $${paramCount}`;
            values.push(userId);
            paramCount++;
        }

        if (startDate) {
            query += ` AND date >= $${paramCount}`;
            values.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND date <= $${paramCount}`;
            values.push(endDate);
            paramCount++;
        }

        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Get category-wise breakdown
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getCategoryBreakdown({ type = null, startDate = null, endDate = null, userId = null, userRole = null }) {
        let query = `
      SELECT 
        t2.category_type,
        t1.type,
        SUM(t1.amount) as total_amount,
        COUNT(t1.*) as transaction_count
      FROM 
        tbl_financial_records t1,
        tbl_categories t2        
      WHERE 
       t1.category_id=t2.id AND
       is_deleted = false
    `;

        const values = [];
        let paramCount = 1;

        // Role-based filtering
        if (userRole === 'viewer' && userId) {
            query += ` AND user_id = $${paramCount}`;
            values.push(userId);
            paramCount++;
        }

        if (type) {
            query += ` AND type = $${paramCount}`;
            values.push(type);
            paramCount++;
        }

        if (startDate) {
            query += ` AND date >= $${paramCount}`;
            values.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND date <= $${paramCount}`;
            values.push(endDate);
            paramCount++;
        }

        query += ' GROUP BY t2.category_type, t1.type ORDER BY total_amount DESC';

        const result = await db.query(query, values);
        return result.rows;
    }

    /**
     * Get recent activity
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getRecentActivity({ resLimit = 10, userId = null, userRole = null }) {
        let query = `
            SELECT t1.id, t1.user_id, t1.creator_id, t1.amount,
                t1.type, t2.category_type, t1.date, t1.description,
                t1.created_at, t1.updated_at
            FROM tbl_financial_records t1,
                tbl_categories t2
            WHERE t1.category_id = t2.id 
                AND is_deleted = false`;

        const values = [];

        // Role-based filtering
        if (userRole === 'viewer' && userId) {
            query += ` AND user_id = $1`;
            values.push(userId);
        }


        query += ` ORDER BY t1.created_at DESC LIMIT $${values.length + 1}`;


        values.push(parseInt(resLimit));

        const result = await db.query(query, values);
        return result.rows;
    }

    /**
     * Get monthly trends
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getMonthlyTrends({ resMonths = 6, userId = null, userRole = null }) {
        let query = `
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        COUNT(*) AS total_transactions,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
      FROM tbl_financial_records 
      WHERE is_deleted = false 
        AND date >= CURRENT_DATE - INTERVAL '${resMonths} months'
    `;

        const values = [];

        // Role-based filtering
        if (userRole === 'viewer' && userId) {
            query += ` AND user_id = $1`;
            values.push(userId);
        }


        query += `
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month DESC
    `;

        const result = await db.query(query, values);
        return result.rows;
    }
}

module.exports = FinancialRecord;