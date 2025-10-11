const permission = require("../middleware/permissionMiddleware");
const auth =  require("../../services/login/auth");
const {getCars, createCar, updateCar, deleteCar, getCarImages, getCarById, uploadImageBase64, getCarImage, serveCarImage,
    getAvailableCars
} = require("../../services/cars/carService");
const { upload, uploadCarImages, deleteCarImage, updateCarImage } = require("../../services/imageService");

module.exports = {
    "getCar" : {
        method: 'get',
        route: '/cars',
        action: [getCars]
    },
    "getCarById":{
      method: 'get',
      route: '/car/:id',
      action: [getCarById]
    },

    "getAvailableCars":
    {
        method:'get',
        route:'/cars/available',
        action:[getAvailableCars]

    },
    "getCarImages":{
      method: 'get',
      route: '/car/:carId/images',
      action: [getCarImages]
    },
    // Upload images
    "uploadCarImages": {
        method: 'post',
        route: '/car/:carId/images',
        action: [auth.authenticateToken, upload.array('images', 10), uploadCarImages]
    },
    // Get single image by ID
    "getCarImage": {
        method: 'get',
        route: '/car/:carId/image/:imageId',
        action: [getCarImage]
    },
    // Serve image file directly
    "serveCarImage": {
        method: 'get',
        route: '/car/:carId/image/:imageId/file',
        action: [serveCarImage]
    },
    // Upload image as base64
    "uploadImageBase64": {
        method: 'post',
        route: '/car/:carId/images/base64',
        action: [auth.authenticateToken, uploadImageBase64]
    },
    "updateCarImage": {
        method: 'put',
        route: '/car/:carId/images/:imageId',
        action: [auth.authenticateToken, updateCarImage]
    },
    "deleteCarImage": {
        method: 'delete',
        route: '/car/:carId/images/:imageId',
        action: [auth.authenticateToken, deleteCarImage]
    },
    "createCar" : {
        method: 'post',
        route: '/cars',
        action: [auth.authenticateToken, permission.requirePermission('car.create'), createCar]
    },
    "updateCar" : {
        method: 'put',
        route: '/cars',
        action: [auth.authenticateToken, permission.requirePermission('car.update'), updateCar]
    },
    "deleteCar" : {
        method: 'delete',
        route: '/cars',
        action: [auth.authenticateToken, permission.requirePermission('car.delete'), deleteCar]
    }
}