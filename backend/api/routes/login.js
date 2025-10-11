const auth = require('../../services/login/auth');


module.exports = {
    login: {
        method: 'post',
        route: '/auth/login',
        action: [auth.login]
    },
    refreshToken: {
        method: 'post',
        route: '/auth/refresh-token',
        action: auth.refreshToken
    },
    logout: {
        method: 'post',
        route: '/auth/logout',
        action: auth.logout
    }
}
