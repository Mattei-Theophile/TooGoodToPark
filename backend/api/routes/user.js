const permission = require("../middleware/permissionMiddleware");
const auth = require("../../services/login/auth");
const register = require("../../services/register");

module.exports = {
  getUserProfile: {
    method: "get",
    route: "/account/me",
    action: [auth.authenticateTokenWithRefresh, register.getUserProfile],
  },
  createUserProfile: {
    method: "post",
    route: "/account/me",
    action: [auth.authenticateTokenWithRefresh],
  },
  updateUserProfile: {
    method: "put",
    route: "/account/me",
    action: [auth.authenticateTokenWithRefresh],
  },
  deleteUserProfile: {
    method: "delete",
    route: "/account/me",
    action: [auth.authenticateTokenWithRefresh],
  },
};
