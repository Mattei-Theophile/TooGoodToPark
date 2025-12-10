const permission = require("../middleware/permissionMiddleware");
const auth = require("../../services/login/auth");
const {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  getCarImages,
  getCarById,
  getMyCars,
  getCarImage,
  getAvailableCars,
} = require("../../services/cars/carService");

const {
  upload,
  uploadCarImages,
  deleteCarImage,
  updateCarImages,
} = require("../../services/cars/imageService");

const { verifyIsCarOwner } = require("../middleware/ownership/carOwnership");

module.exports = {
  getCar: {
    method: "get",
    route: "/cars",
    action: [getCars],
  },
  getCarById: {
    method: "get",
    route: "/car/:id",
    action: [getCarById],
  },
  getMyCars: {
    method: "get",
    route: "/cars/mycars",
    action: [auth.authenticateTokenWithRefresh, getMyCars],
  },
  createCar: {
    method: "post",
    route: "/cars",
    action: [auth.authenticateTokenWithRefresh, createCar],
  },
  updateCar: {
    method: "put",
    route: "/cars",
    action: [auth.authenticateTokenWithRefresh, updateCar],
  },
  deleteCar: {
    method: "delete",
    route: "/cars/:carId",
    action: [auth.authenticateTokenWithRefresh, deleteCar],
  },
  ////////////////////// Search Car Routes ////////////////////////
  getAvailableCars: {
    method: "get",
    route: "/cars/available",
    action: [getAvailableCars],
  },

  /////////////////////// Car Images Routes ////////////////////////
  getCarImage: {
    method: "get",
    route: "/car/:carId/image/:imageId",
    action: [getCarImage],
  },

  getCarImages: {
    method: "get",
    route: "/car/:carId/images",
    action: [getCarImages],
  },
  uploadCarImages: {
    method: "post",
    route: "/cars/:carId/images",
    action: [
      auth.authenticateTokenWithRefresh,
      upload.array("images", 10),
      uploadCarImages,
    ],
  },
  updateCarImages: {
    method: "put",
    route: "/cars/:carId/images",
    action: [
      auth.authenticateTokenWithRefresh,
      upload.array("images", 10),
      updateCarImages,
    ],
  },
  deleteCarImages: {
    method: "delete",
    route: "/cars/:carId/images",
    action: [auth.authenticateTokenWithRefresh, deleteCarImage],
  },
};
