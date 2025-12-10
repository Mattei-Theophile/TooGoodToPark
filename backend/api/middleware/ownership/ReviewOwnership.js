const {
  createOwnershipVerifier,
  createMultipleOwnershipVerifier,
} = require("./ownership.factory");

const { checkReviewOwnership } = require("./ownership.checks");

// Verifies the user IS the owner
const verifyIsReviewOwner = createOwnershipVerifier({
  checkFunction: checkReviewOwnership,
  resourceName: "review",
  isOwner: true,
  idSource: "params",
  idKeys: ["id", "carId"],
  errorMsg: "You can only modify your own reviews",
});

// Verifies the user IS NOT the owner
const verifyIsNotReviewOwner = createOwnershipVerifier({
  checkFunction: checkReviewOwnership,
  resourceName: "review",
  isOwner: false,
  idSource: "params",
  idKeys: ["id", "carId"],
  errorMsg: "You cannot perform this action on your own review",
});

// Verifies the user IS the owner of multiple
const verifyAreReviewsOwner = createMultipleOwnershipVerifier({
  checkFunction: checkReviewOwnership,
  resourceName: "reviews",
  isOwner: true,
  idKey: "carIds",
  idProperty: "ID_Review",
  errorMsg: "You can only modify your own reviews",
});

// Verifies the user IS NOT the owner of multiple
const verifyAreNotReviewsOwner = createMultipleOwnershipVerifier({
  checkFunction: checkReviewOwnership,
  resourceName: "reviews",
  isOwner: false,
  idKey: "carIds",
  idProperty: "ID_Review",
  errorMsg: "You cannot perform this action on one or more of your own reviews",
});

module.exports = {
  verifyIsReviewOwner,
  verifyIsNotReviewOwner,
  verifyAreReviewsOwner,
  verifyAreNotReviewsOwner,
};
