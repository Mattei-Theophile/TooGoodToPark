const {getUserProfile, register} = require("../../services/register");
const {authenticateToken} = require("../../services/login/auth");

module.exports = {
    register: {
        method: 'post',
        route: '/auth/register',
        action: register
    }
}