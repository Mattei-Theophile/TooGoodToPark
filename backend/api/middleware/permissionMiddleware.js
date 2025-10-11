const permissionService = require('../../services/login/permissions');

/**
 * Middleware to check if user has required permission
 * @param {string} permission - Required permission name
 * @returns {Function}
 */
function requirePermission(permission) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id || req.user?.ID_Client;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const hasPermission = await permissionService.hasPermission(userId, permission);

            if (!hasPermission) {
                // Log unauthorized access attempt

                await permissionService.logActivity(
                    userId,
                    'unauthorized_access',
                    'permission',
                    null,
                    { required_permission: permission },
                    req.ip,
                    req.get('User-Agent')
                );

                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions',
                    required_permission: permission
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Permission check failed'
            });
        }
    };
}

/**
 * Middleware to check resource-based permissions
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {Function}
 */
function requireResourcePermission(resource, action) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id || req.user?.ID_Client;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const hasPermission = await permissionService.hasResourcePermission(userId, resource, action);

            if (!hasPermission) {
                await permissionService.logActivity(
                    userId,
                    'unauthorized_access',
                    resource,
                    null,
                    { required_action: action },
                    req.ip,
                    req.get('User-Agent')
                );

                return res.status(403).json({
                    success: false,
                    message: `Insufficient permissions for ${action} on ${resource}`
                });
            }

            next();
        } catch (error) {
            console.error('Resource permission check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Permission check failed'
            });
        }
    };
}

/**
 * Middleware to check content-specific permissions
 * @param {string} action - Action to perform on content
 * @returns {Function}
 */
function requireContentPermission(action) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id || req.user?.ID_Client;
            const contentId = req.params.id || req.params.contentId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            if (!contentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Content ID required'
                });
            }

            const hasPermission = await permissionService.hasContentPermission(userId, contentId, action);

            if (!hasPermission) {
                await permissionService.logActivity(
                    userId,
                    'unauthorized_content_access',
                    'content',
                    contentId,
                    { required_action: action },
                    req.ip,
                    req.get('User-Agent')
                );

                return res.status(403).json({
                    success: false,
                    message: `Insufficient permissions to ${action} this content`
                });
            }

            next();
        } catch (error) {
            console.error('Content permission check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Permission check failed'
            });
        }
    };
}

/**
 * Middleware to check if user has any of the specified roles
 * @param {Array<string>} allowedRoles - Array of allowed role names
 * @returns {Function}
 */
function requireRole(allowedRoles) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id || req.user?.ID_Client;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const userRole = await permissionService.getUserRole(userId);

            if (!userRole || !allowedRoles.includes(userRole.Nom_Role)) {
                await permissionService.logActivity(
                    userId,
                    'unauthorized_role_access',
                    'role',
                    null,
                    {
                        user_role: userRole?.Nom_Role,
                        required_roles: allowedRoles
                    },
                    req.ip,
                    req.get('User-Agent')
                );

                return res.status(403).json({
                    success: false,
                    message: 'Insufficient role privileges',
                    required_roles: allowedRoles,
                    user_role: userRole?.Nom_Role
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Role check failed'
            });
        }
    };
}

module.exports = {
    requirePermission,
    requireResourcePermission,
    requireContentPermission,
    requireRole
};