const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

class AuthService {
    /**
     * Login user
     */
    static async login({ email, password }) {
        // Find user by email
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findByEmail(email);
        if (!user) {
            throw { statusCode: 401, message: 'Invalid email or password' };
        }

        // Check if user is active
        if (user.status !== 'active') {
            throw { statusCode: 403, message: 'Account is inactive. Please contact administrator.' };
        }

        // Verify password
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw { statusCode: 401, message: 'Invalid email or password' };
        }

        // Generate token
        const token = this.generateToken(user);

        // Remove password from response
        delete user.password;

        return { user, token };
    }

    /**
     * Generate JWT token
     */
    static generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
    }

    /**
     * Get current user profile
     */
    static async getProfile(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw { statusCode: 404, message: 'User not found' };
        }
        return user;
    }
}

module.exports = AuthService;