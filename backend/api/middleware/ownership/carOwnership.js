const {
  createOwnershipVerifier,
  createMultipleOwnershipVerifier,
} = require("./ownership.factory");

const { checkCarOwnership } = require("./ownership.checks");

// Verifies the user IS the owner of a single car
const verifyIsCarOwner = createOwnershipVerifier({
  checkFunction: checkCarOwnership,
  resourceName: "car",
  isOwner: true,
  idSource: "body", // Car check uses req.body
  idKeys: ["ID_Car"],
  errorMsg: "You can only modify your own car listings",
});

// Verifies the user IS NOT the owner of a single car
const verifyIsNotCarOwner = createOwnershipVerifier({
  checkFunction: checkCarOwnership,
  resourceName: "car",
  isOwner: false,
  idSource: "body",
  idKeys: ["ID_Car"],
  errorMsg: "You cannot perform this action on your own car listing",
});

// Verifies the user IS the owner of multiple cars
const verifyAreCarsOwner = createMultipleOwnershipVerifier({
  checkFunction: checkCarOwnership,
  resourceName: "cars",
  isOwner: true,
  idKey: "carIds",
  idProperty: "ID_Car",
  errorMsg: "You can only modify your own car listings",
});

// Verifies the user IS NOT the owner of multiple cars
const verifyAreNotCarsOwner = createMultipleOwnershipVerifier({
  checkFunction: checkCarOwnership,
  resourceName: "cars",
  isOwner: false,
  idKey: "carIds",
  idProperty: "ID_Car",
  errorMsg:
    "You cannot perform this action on one or more of your own car listings",
});

module.exports = {
  verifyIsCarOwner,
  verifyIsNotCarOwner,
  verifyAreCarsOwner,
  verifyAreNotCarsOwner,
};
