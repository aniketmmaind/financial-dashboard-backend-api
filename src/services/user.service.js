const User = require('../models/User');

class UserService {
    /**
     * Get all users
     */
    static async getAllUsers(filters) {
        return await User.findAll(filters);
    }

    /**
     * Get user by ID
     */
    static async getUserById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw { statusCode: 404, message: 'User not found' };
        }
        return user;
    }

    /**
     * Create new user
     */
    static async createUser(userData) {
        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
            throw { statusCode: 409, message: 'User already exists with this email' };
        }

        return await User.create(userData);
    }

    /**
     * Update user
     */
    static async updateUser(id, updates) {
        const user = await User.findById(id);
        if (!user) {
            throw { statusCode: 404, message: 'User not found' };
        }

        // Check if email is being changed and already exists
        if (updates.email && updates.email !== user.email) {
            const existingUser = await User.findByEmail(updates.email);
            if (existingUser) {
                throw { statusCode: 409, message: 'Email already in use' };
            }
        }

        return await User.update(id, updates);
    }

    /**
     * Delete user
     */
    static async deleteUser(id) {
        const user = await User.findById(id);
        if (!user) {
            throw { statusCode: 404, message: 'User not found' };
        }

        return await User.delete(id);
    }
}

module.exports = UserService;