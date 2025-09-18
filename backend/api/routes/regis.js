const {getUserProfile, register} = require("../../services/register");
const {authenticateToken} = require("../../services/auth");

module.exports = {
    register: {
        method: 'post',
        route: '/auth/register',
        action: register
    }
}