
const auth = require('../../services/login/auth');
const {getReviews, updateReview, deleteReview, createReview} = require("../../services/cars/reviewService");

module.exports = {
    getReviews: {
        method: 'get',
        route: '/cars/:id/reviews',
        action: [getReviews]
    },
    createReview: {
        method: 'post',
        route: '/cars/:id/reviews',
        action: [auth.authenticateToken, createReview]
    },
    updateReview: {
        method: 'put',
        route: '/cars/:id/reviews',
        action: [auth.authenticateToken,updateReview]
    },
    deleteReview: {
        method: 'delete',
        route: '/cars/:id/reviews',
        action: [auth.authenticateToken, deleteReview]
    }
}