const reservation = require("../../services/cars/reservationService");
const auth = require("../../services/login/auth");

module.exports = {
    getReservations: {
        method: 'get',
        route: '/cars/:id/reservations',
        action: [auth.authenticateToken, reservation.getReservation]
    },
    // Get reservations by specific user ID
    getReservationsByUser: {
        method: 'get',
        route: '/users/:userId/reservations',
        action: [auth.authenticateToken, reservation.getReservationsByUser]
    },
    // Get current user's reservations
    getMyReservations: {
        method: 'get',
        route: '/cars/myreservations',
        action: [auth.authenticateToken, reservation.getMyReservations]
    },
    createReservation: {
        method: 'post',
        route: '/cars/:id/reservations',
        action: [auth.authenticateToken, reservation.createReservation]
    },
    updateReservation: {
        method: 'put',
        route: '/cars/:id/reservations',
        action: [auth.authenticateToken, reservation.updateReservation]
    },
    deleteReservation: {
        method: 'delete',
        route: '/cars/:id/reservations',
        action: [auth.authenticateToken, reservation.deleteReservation]
    }
}