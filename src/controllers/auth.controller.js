const AuthService = require('../services/auth.service');
const { success, error } = require('../utils/response');

class AuthController {
    /**
     * Login user
     */
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await AuthService.login({ email, password });

            return success(res, result, 'Login successful');
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile(req, res, next) {
        try {
            const userId = req.user.id;

            const user = await AuthService.getProfile(userId);

            return success(res, user, 'Profile retrieved successfully');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AuthController;