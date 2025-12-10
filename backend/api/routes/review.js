const auth = require("../../services/login/auth");
const {
  getReviews,
  updateReview,
  deleteReview,
  createReview,
} = require("../../services/cars/reviewService");

const {
  verifyReviewOwnership,
  verifyIsNotReviewOwner,
  verifyIsReviewOwner,
} = require("../middleware/ownership/ReviewOwnership");

module.exports = {
  getReviews: {
    method: "get",
    route: "/cars/:id/reviews",
    action: [getReviews],
  },
  createReview: {
    method: "post",
    route: "/cars/:id/reviews",
    action: [auth.authenticateTokenWithRefresh, createReview],
  },
  updateReview: {
    method: "put",
    route: "/reviews/:id",
    action: [auth.authenticateTokenWithRefresh, updateReview],
  },
  deleteReview: {
    method: "delete",
    route: "/reviews/:id",
    action: [auth.authenticateTokenWithRefresh, deleteReview],
  },
};
