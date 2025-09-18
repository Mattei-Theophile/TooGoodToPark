const {Database} = require('../database/database');

class PermissionService {
    constructor() {

        this.connection = new Database().connect();
    }

    /**
     * Check if a user has a specific permission
     * @param {number} userId - The user's ID
     * @param {string} permission - The permission to check (e.g., 'content.create')
     * @returns {Promise<boolean>}
     */
    async hasPermission(userId, permission) {
        try {
            const [rows] = await this.connection.promise().query(`
                SELECT COUNT(*) as count
                FROM Client c
                JOIN Role r ON c.ID_Role = r.ID_Role
                JOIN Role_Permission rp ON r.ID_Role = rp.ID_Role
                JOIN Permission p ON rp.ID_Permission = p.ID_Permission
                WHERE c.ID_Client = ? AND p.Nom_Permission = ? AND c.Is_Active = 1
            `, [userId, permission]);

            return rows[0].count > 0;
        } catch (error) {
            console.error('Error checking permission:', error);
            return false;
        }
    }

    /**
     * Check if a user has permission for a specific resource and action
     * @param {number} userId - The user's ID
     * @param {string} resource - The resource (e.g., 'content', 'user')
     * @param {string} action - The action (e.g., 'create', 'read', 'update', 'delete')
     * @returns {Promise<boolean>}
     */
    async hasResourcePermission(userId, resource, action) {
        try {
            const [rows] = await this.connection.promise().query(`
                SELECT COUNT(*) as count
                FROM Client c
                JOIN Role r ON c.ID_Role = r.ID_Role
                JOIN Role_Permission rp ON r.ID_Role = rp.ID_Role
                JOIN Permission p ON rp.ID_Permission = p.ID_Permission
                WHERE c.ID_Client = ? AND p.Resource = ? AND p.Action = ? AND c.Is_Active = 1
            `, [userId, resource, action]);

            return rows[0].count > 0;
        } catch (error) {
            console.error('Error checking resource permission:', error);
            return false;
        }
    }

    /**
     * Check if a user can access specific content
     * @param {number} userId - The user's ID
     * @param {number} contentId - The content's ID
     * @param {string} action - The action ('view', 'edit', 'delete', 'publish')
     * @returns {Promise<boolean>}
     */
    async hasContentPermission(userId, contentId, action) {
        try {
            // First check if user is the content author
            const [authorCheck] = await this.connection.promise().query(`
                SELECT ID_Author FROM Content WHERE ID_Content = ?
            `, [contentId]);

            if (authorCheck.length > 0 && authorCheck[0].ID_Author === userId) {
                // Authors can always view and edit their own content
                if (action === 'view' || action === 'edit') return true;
            }

            // Check role-based content permissions
            const [rows] = await this.connection.promise().query(`
                SELECT 
                    cp.Can_View, cp.Can_Edit, cp.Can_Delete, cp.Can_Publish
                FROM Client c
                JOIN Content_Permission cp ON c.ID_Role = cp.ID_Role
                WHERE c.ID_Client = ? AND cp.ID_Content = ? AND c.Is_Active = 1
            `, [userId, contentId]);

            if (rows.length === 0) return false;

            const permissions = rows[0];
            switch (action) {
                case 'view': return permissions.Can_View === 1;
                case 'edit': return permissions.Can_Edit === 1;
                case 'delete': return permissions.Can_Delete === 1;
                case 'publish': return permissions.Can_Publish === 1;
                default: return false;
            }
        } catch (error) {
            console.error('Error checking content permission:', error);
            return false;
        }
    }

    /**
     * Get all permissions for a user
     * @param {number} userId - The user's ID
     * @returns {Promise<Array>}
     */
    async getUserPermissions(userId) {
        try {
            const [rows] = await this.connection.promise().query(`
                SELECT DISTINCT p.Nom_Permission, p.Description_Permission, p.Resource, p.Action
                FROM Client c
                JOIN Role r ON c.ID_Role = r.ID_Role
                JOIN Role_Permission rp ON r.ID_Role = rp.ID_Role
                JOIN Permission p ON rp.ID_Permission = p.ID_Permission
                WHERE c.ID_Client = ? AND c.Is_Active = 1
                ORDER BY p.Resource, p.Action
            `, [userId]);

            return rows;
        } catch (error) {
            console.error('Error getting user permissions:', error);
            return [];
        }
    }

    /**
     * Get user role information
     * @param {number} userId - The user's ID
     * @returns {Promise<Object|null>}
     */
    async getUserRole(userId) {
        try {
            const [rows] = await this.connection.promise().query(`
                SELECT r.ID_Role, r.Nom_Role, r.Description_Role
                FROM Client c
                JOIN Role r ON c.ID_Role = r.ID_Role
                WHERE c.ID_Client = ? AND c.Is_Active = 1
            `, [userId]);

            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    }

    /**
     * Update user role
     * @param {number} userId - The user's ID
     * @param {number} roleId - The new role ID
     * @param {number} adminId - The admin performing the action
     * @returns {Promise<boolean>}
     */
    async updateUserRole(userId, roleId, adminId) {
        try {
            // Check if admin has permission to update users
            const hasPermission = await this.hasPermission(adminId, 'user.update');
            if (!hasPermission) {
                throw new Error('Insufficient permissions to update user role');
            }

            await this.connection.promise().query(`
                UPDATE Client SET ID_Role = ?, Updated_At = CURRENT_TIMESTAMP 
                WHERE ID_Client = ?
            `, [roleId, userId]);

            // Log the activity
            await this.logActivity(adminId, 'role_update', 'user', userId, {
                new_role_id: roleId,
                target_user_id: userId
            });

            return true;
        } catch (error) {
            console.error('Error updating user role:', error);
            return false;
        }
    }

    /**
     * Log user activity
     * @param {number} userId - The user's ID
     * @param {string} action - The action performed
     * @param {string} resourceType - The type of resource
     * @param {number} resourceId - The resource ID
     * @param {Object} details - Additional details
     * @param {string} ipAddress - User's IP address
     * @param {string} userAgent - User's browser agent
     * @returns {Promise<void>}
     */
    async logActivity(userId, action, resourceType, resourceId = null, details = {}, ipAddress = null, userAgent = null) {
        try {
            await this.connection.promise().query(`
                INSERT INTO Activity_Log 
                (ID_Client, Action, Resource_Type, Resource_ID, Details, IP_Address, User_Agent)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                userId,
                action,
                resourceType,
                resourceId,
                JSON.stringify(details),
                ipAddress,
                userAgent
            ]);
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }

    /**
     * Set content permissions for a role
     * @param {number} contentId - The content ID
     * @param {number} roleId - The role ID
     * @param {Object} permissions - Permission object {canView, canEdit, canDelete, canPublish}
     * @returns {Promise<boolean>}
     */
    async setContentPermissions(contentId, roleId, permissions) {
        try {
            await this.connection.promise().query(`
                INSERT INTO Content_Permission 
                (ID_Content, ID_Role, Can_View, Can_Edit, Can_Delete, Can_Publish)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                Can_View = VALUES(Can_View),
                Can_Edit = VALUES(Can_Edit),
                Can_Delete = VALUES(Can_Delete),
                Can_Publish = VALUES(Can_Publish)
            `, [
                contentId,
                roleId,
                permissions.canView ? 1 : 0,
                permissions.canEdit ? 1 : 0,
                permissions.canDelete ? 1 : 0,
                permissions.canPublish ? 1 : 0
            ]);

            return true;
        } catch (error) {
            console.error('Error setting content permissions:', error);
            return false;
        }
    }
}

module.exports = new PermissionService();