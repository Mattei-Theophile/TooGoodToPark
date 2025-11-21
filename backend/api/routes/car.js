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
  searchCars,
} = require("../../services/cars/carService");

const {
  upload,
  uploadCarImages,
  deleteCarImage,
  updateCarImage,
} = require("../../services/imageService");
const { verifyCarOwnership } = require("../middleware/ownership/carOwnership");

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

  getAvailableCars: {
    method: "get",
    route: "/cars/available",
    action: [getAvailableCars],
  },
  getSearchedCars: {
    method: "get",
    route: "/cars/search",
    action: [searchCars],
  },
  getMyCars: {
    method: "get",
    route: "/cars/mycars",
    action: [auth.authenticateTokenWithRefresh, getMyCars],
  },
  getCarImages: {
    method: "get",
    route: "/car/:carId/images",
    action: [getCarImages],
  },
  // Upload images
  uploadCarImages: {
    method: "post",
    route: "/car/:carId/images",
    action: [
      auth.authenticateTokenWithRefresh,
      upload.array("images", 10),
      uploadCarImages,
    ],
  },
  // Get single image by ID
  getCarImage: {
    method: "get",
    route: "/car/:carId/image/:imageId",
    action: [getCarImage],
  },
  updateCarImage: {
    method: "put",
    route: "/car/:carId/images/:imageId",
    action: [auth.authenticateTokenWithRefresh, updateCarImage],
  },
  deleteCarImage: {
    method: "delete",
    route: "/car/:carId/images/:imageId",
    action: [auth.authenticateTokenWithRefresh, deleteCarImage],
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
    route: "/cars",
    action: [auth.authenticateTokenWithRefresh, deleteCar],
  },
};
