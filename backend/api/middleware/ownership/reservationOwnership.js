const {
  createOwnershipVerifier,
  createMultipleOwnershipVerifier,
} = require("./ownership.factory");
const { checkReservationOwnership } = require("./ownership.checks");

// Verifies the user IS the owner
const verifyIsReservationOwner = createOwnershipVerifier({
  checkFunction: checkReservationOwnership,
  resourceName: "reservation",
  isOwner: true,
  idSource: "params",
  idKeys: ["id", "reservationId"],
  errorMsg: "You can only modify your own reservations",
});

// Verifies the user IS NOT the owner
const verifyIsNotReservationOwner = createOwnershipVerifier({
  checkFunction: checkReservationOwnership,
  resourceName: "reservation",
  isOwner: false,
  idSource: "params",
  idKeys: ["id", "reservationId"],
  errorMsg: "You cannot perform this action on your own reservation",
});

// Verfies the user IS the owner of multiple
const verifyAreReservationsOwner = createMultipleOwnershipVerifier({
  checkFunction: checkReservationOwnership,
  resourceName: "reservations",
  isOwner: true,
  idKey: "reservationIds",
  idProperty: "ID_Reservation",
  errorMsg: "You can only modify your own reservations",
});

// Verfies the user IS NOT the owner of multiple
const verifyAreNotReservationsOwner = createMultipleOwnershipVerifier({
  checkFunction: checkReservationOwnership,
  resourceName: "reservations",
  isOwner: false,
  idKey: "reservationIds",
  idProperty: "ID_Reservation",
  errorMsg:
    "You cannot perform this action on one or more of your own reservations",
});

module.exports = {
  verifyIsReservationOwner,
  verifyIsNotReservationOwner,
  verifyAreReservationsOwner,
  verifyAreNotReservationsOwner,
};
