const rental = require("../../services/cars/rentalService");
const auth = require("../../services/login/auth");
module.exports = {
    getRenter:{
        method: 'get',
        route: '/cars/:id/renter',
        action: [ rental.getRenter]
    },
    createRental:{
        method: 'post',
        route: '/cars/:id/rental',
        action: [auth.authenticateToken, rental.createRental]
    },
    updateRental:{
        method: 'put',
        route: '/cars/:id/rental',
        action: [auth.authenticateToken, rental.updateRental]
    },
    deleteRental:{
        method: 'delete',
        route: '/cars/:id/rental',
        action: [auth.authenticateToken, rental.deleteRental]
    }
}