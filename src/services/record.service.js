const FinancialRecord = require('../models/FinancialRecord');
const User = require('../models/User');

class RecordService {
    /**
     * Get all records with filters
     */
    static async getAllRecords(filters) {
        return await FinancialRecord.findAll(filters);
    }

    /**
     * Get record by ID
     */
    static async getRecordById(id) {
        const record = await FinancialRecord.findById(id);
        if (!record) {
            throw { statusCode: 404, message: 'Record not found' };
        }
        return record;
    }

    /**
     * Create new record
     */
    static async createRecord(recordData) {
        //Check whether Category is already exists or not
        const isUserDeleted = await User.findByIdAndStatus(recordData.userId, 'deleted');

        if (isUserDeleted) {
            throw { statusCode: 409, message: 'User Not Found' }
        }
        return await FinancialRecord.create(recordData);
    }

    /**
     * Update record
     */
    static async updateRecord(id, updates) {
        const record = await FinancialRecord.findById(id);
        if (!record) {
            throw { statusCode: 404, message: 'Record not found' };
        }

        return await FinancialRecord.update(id, updates);
    }

    /**
     * Delete record (soft delete)
     */
    static async deleteRecord(id) {
        const record = await FinancialRecord.findById(id);
        if (!record) {
            throw { statusCode: 404, message: 'Record not found' };
        }

        return await FinancialRecord.softDelete(id);
    }
}

module.exports = RecordService;