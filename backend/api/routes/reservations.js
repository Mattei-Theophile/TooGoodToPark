const reservation = require("../../services/cars/reservationService");
const auth = require("../../services/login/auth");

module.exports = {
  getReservations: {
    method: "get",
    route: "/cars/:id/reservations",
    action: [reservation.getReservation],
  },
  // Get reservations by specific user ID
  getReservationsByUser: {
    method: "get",
    route: "/users/:userId/reservations",
    action: [
      auth.authenticateTokenWithRefresh,
      reservation.getReservationsByUser,
    ],
  },
  // Get current user's reservations
  getMyReservations: {
    method: "get",
    route: "/cars/myreservations",
    action: [auth.authenticateTokenWithRefresh, reservation.getMyReservations],
  },
  createReservation: {
    method: "post",
    route: "/cars/reservations",
    action: [auth.authenticateTokenWithRefresh, reservation.createReservation],
  },
  updateReservation: {
    method: "put",
    route: "/cars/reservations",
    action: [auth.authenticateTokenWithRefresh, reservation.updateReservation],
  },
  deleteReservation: {
    method: "delete",
    route: "/cars/reservations",
    action: [auth.authenticateTokenWithRefresh, reservation.deleteReservation],
  },
};
