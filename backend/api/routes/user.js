const permission = require("../middleware/permissionMiddleware");
const auth =  require("../../services/login/auth");
const register = require("../../services/register");

module.exports = {
    getUserProfile: {
        method: 'get',
        route: '/account/me',
        action: [auth.authenticateTokenWithRefresh, register.getUserProfile]
    },
    createUserProfile: {
        method: 'post',
        route: '/account/me',
        action: [auth.authenticateTokenWithRefresh, permission.requirePermission('user.create') ]
    },
    updateUserProfile: {
        method: 'put',
        route: '/account/me',
        action: [auth.authenticateTokenWithRefresh, permission.requirePermission('user.update')]
    },
    deleteUserProfile: {
        method: 'delete',
        route: '/account/me',
        action: [ auth.authenticateTokenWithRefresh, permission.requirePermission('user.delete')]
    }
}