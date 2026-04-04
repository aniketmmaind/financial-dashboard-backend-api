const FinancialRecord = require('../models/FinancialRecord');

class DashboardService {
    /**
     * Get overall summary
     */
    static async getSummary(filters) {
        return await FinancialRecord.getSummary(filters);
    }

    /**
     * Get category-wise breakdown
     */
    static async getCategoryBreakdown(filters) {
        return await FinancialRecord.getCategoryBreakdown(filters);
    }

    /**
     * Get recent activity
     */
    static async getRecentActivity(filters) {
        return await FinancialRecord.getRecentActivity(filters);
    }

    /**
     * Get monthly trends
     */
    static async getMonthlyTrends(filters) {
        return await FinancialRecord.getMonthlyTrends(filters);
    }

    /**
     * Get complete dashboard data
     */
    static async getDashboardData(filters) {
        const {
            startDate,
            endDate,
            userId,
            userRole,
            resLimit,
            resMonths,
            type
        } = filters;

        const commonFilters = { startDate, endDate, userId, userRole };
        const [summary, categoryBreakdown, recentActivity, monthlyTrends] = await Promise.all([


            this.getSummary(commonFilters),
            this.getCategoryBreakdown({ ...commonFilters, type }),
            this.getRecentActivity({ resLimit, userId, userRole }),
            this.getMonthlyTrends({ resMonths, userId, userRole})
        ]);

        return {
            summary,
            categoryBreakdown,
            recentActivity,
            monthlyTrends
        };
    }
}

module.exports = DashboardService;