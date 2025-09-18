
const auth =  require("../../services/auth");
const settings = require("../../services/settingsService")
module.exports = {
    getUserSettings: {
        method: 'get',
        route: '/account/settings',
        action: [auth.authenticateToken]
    },
    createUserSettings: {
        method: 'post',
        route: '/account/settings',
        action: [auth.authenticateToken]
    },
    updateUserSettings: {
        method: 'put',
        route: '/account/settings',
        action: [auth.authenticateToken]
    },
    deleteUserSettings: {
        method: 'delete',
        route: '/account/settings',
        action: [auth.authenticateToken]
    }

}