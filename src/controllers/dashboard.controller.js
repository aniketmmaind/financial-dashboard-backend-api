const DashboardService = require('../services/dashboard.service');
const { success } = require('../utils/response');

class DashboardController {
    /**
     * Get summary statistics
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getSummary(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const userId = req.user.id;
            const userRole = req.user.role;

            const summary = await DashboardService.getSummary(
                {
                    startDate,
                    endDate,
                    userId,
                    userRole
                }
            );

            return success(res, summary, 'Summary retrieved successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get category breakdown
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getCategoryBreakdown(req, res, next) {
        try {
            const { type, startDate, endDate } = req.query;
            const userId = req.user.id;
            const userRole = req.user.role;

            const breakdown = await DashboardService.getCategoryBreakdown(
                {
                    type,
                    startDate,
                    endDate,
                    userId,
                    userRole,
                }
            );

            return success(res, breakdown, 'Category breakdown retrieved successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get recent activity
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getRecentActivity(req, res, next) {
        try {
            const { limit } = req.query;
            const userId = req.user.id;
            const userRole = req.user.role;
            const resLimit = parseInt(limit) || 10;
            const activity = await DashboardService.getRecentActivity(
                {
                    resLimit,
                    userId,
                    userRole
                }
            );

            return success(res, activity, 'Recent activity retrieved successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get monthly trends
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getMonthlyTrends(req, res, next) {
        try {
            const { months } = req.query;
            const userId = req.user.id;
            const userRole = req.user.role;
            const resMonths = parseInt(months) || 6;

            const trends = await DashboardService.getMonthlyTrends(
                {
                    resMonths,
                    userId,
                    userRole
                }
            );

            return success(res, trends, 'Monthly trends retrieved successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get complete dashboard data
     * Role-based: Viewers see their own data, Analysts/Admins see all
     */
    static async getDashboardData(req, res, next) {
        try {
            const { startDate, endDate, limit, months, type } = req.query;
            const userId = req.user.id;
            const userRole = req.user.role;
            const resLimit = parseInt(limit) || 10;
            const resMonths = parseInt(months) || 6;


            const dashboardData = await DashboardService.getDashboardData(
                {
                    startDate,
                    endDate,
                    userId,
                    userRole,
                    resLimit,
                    resMonths,
                    type
                }
            );

            return success(res, dashboardData, 'Dashboard data retrieved successfully');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = DashboardController;