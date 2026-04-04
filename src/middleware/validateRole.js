const { error } = require('../utils/response');

/**
 * Role hierarchy for access control
 * Higher number = more permissions
 */
const roleHierarchy = {
    viewer: 1,
    analyst: 2,
    admin: 3
};

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Role(s) that can access the route
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return error(res, 'User not authenticated', 401);
        }

        const userRole = req.user.role;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        // Check if user's role is in allowed roles
        if (roles.includes(userRole)) {
            return next();
        }

        return error(res, 'Insufficient permissions', 403);
    };
};

/**
 * Middleware to check if user has minimum role level
 * @param {string} minimumRole - Minimum role required
 */
const requireMinimumRole = (minimumRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return error(res, 'User not authenticated', 401);
        }

        const userRoleLevel = roleHierarchy[req.user.role] || 0;
        const requiredRoleLevel = roleHierarchy[minimumRole] || 0;

        if (userRoleLevel >= requiredRoleLevel) {
            return next();
        }

        return error(res, 'Insufficient permissions', 403);
    };
};

module.exports = {
    requireRole,
    requireMinimumRole
};