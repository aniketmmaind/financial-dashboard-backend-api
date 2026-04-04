const RecordService = require('../services/record.service');
const { success, error, paginated } = require('../utils/response');

class RecordController {
    /**
     * Get all records
     * Role-based: Viewers see only their records, Analysts/Admins see all
     */
    static async getAllRecords(req, res, next) {
        try {
            const { page, limit, type, category, startDate, endDate, search } = req.query;

            const result = await RecordService.getAllRecords(
                {
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 10,
                    type,
                    category,
                    startDate,
                    endDate,
                    search
                },
            );

            return paginated(
                res,
                result.records,
                {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                },
                'Records retrieved successfully'
            );
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get record by ID
     */
    static async getRecordById(req, res, next) {
        try {
            const { id } = req.params;

            const record = await RecordService.getRecordById(id);

            return success(res, record, 'Record retrieved successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create new record
     */
    static async createRecord(req, res, next) {
        try {
            const { userId, amount, type, categoryId, date, description } = req.body;
            const creatorId = req.user.id;

            const record = await RecordService.createRecord({
                userId,
                creatorId,
                amount,
                type,
                categoryId,
                date,
                description
            });

            return success(res, record, 'Record created successfully', 201);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update record
     */
    static async updateRecord(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const record = await RecordService.updateRecord(id, updates);

            return success(res, record, 'Record updated successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete record
     */
    static async deleteRecord(req, res, next) {
        try {
            const { id } = req.params;

            await RecordService.deleteRecord(id);

            return success(res, null, 'Record deleted successfully');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = RecordController;