
const auth =  require("../../services/login/auth");
const settings = require("../../services/settingsService")
module.exports = {
    getUserSettings: {
        method: 'get',
        route: '/account/settings',
        action: [auth.authenticateTokenWithRefresh, settings.getSettingsById]
    },
    createUserSettings: {
        method: 'post',
        route: '/account/settings',
        action: [auth.authenticateTokenWithRefresh, settings.createSettings]
    },
    updateUserSettings: {
        method: 'put',
        route: '/account/settings',
        action: [auth.authenticateTokenWithRefresh, settings.updateSettings]
    },
    deleteUserSettings: {
        method: 'delete',
        route: '/account/settings',
        action: [auth.authenticateTokenWithRefresh, settings.deleteSettings]
    }

}