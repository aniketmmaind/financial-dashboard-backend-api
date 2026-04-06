const UserService = require('../services/user.service');
const { success, error, paginated } = require('../utils/response');

class UserController {
    /**
     * Get all users
     */
    static async getAllUsers(req, res, next) {
        try {
            const { page, limit, role, status } = req.query;

            const result = await UserService.getAllUsers({
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                role,
                status
            });

            return paginated(
                res,
                result.users,
                {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                },
                'Users retrieved successfully'
            );
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get user by ID
     */
    static async getUserById(req, res, next) {
        try {
            const { id } = req.params;

            const user = await UserService.getUserById(id);

            return success(res, user, 'User retrieved successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create new user
     */
    static async createUser(req, res, next) {
        try {
            const userData = req.body;

            const user = await UserService.createUser(userData);

            return success(res, user, 'User created successfully', 201);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update user by id
     */
    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            const user = await UserService.updateUser(id, updates);

            return success(res, user, 'User updated successfully');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete user by id
     */
    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;

            await UserService.deleteUser(id);

            return success(res, null, 'User deleted successfully');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;