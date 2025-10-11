const database = require("../../database/database");

/**
 * Get current renter information for a specific car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getRenter(req, res) {
    try {
        const { id } = req.params;

        // Validate car exists
        const [carExists] = await database.query(
            'SELECT ID_Car, Name_Car, Marque_Car, Modele_Car FROM Car WHERE ID_Car = ?',
            [id]
        );

        if (carExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Get current active rental information
        const [activeRental] = await database.query(`
            SELECT 
                ar.ID_Active_Rental,
                ar.Start_Date,
                ar.End_Date,
                ar.Actual_Pickup_Time,
                ar.Expected_Return_Time,
                ar.Current_Mileage,
                ar.Security_Deposit_Amount,
                ar.Security_Deposit_Status,
                ar.Rental_Status,
                ar.Emergency_Contact,
                ar.Special_Instructions,
                ar.Created_At,
                c.ID_Client,
                c.Nom_Client,
                c.Prenom_Client,
                c.Email_Client,
                c.Numero_Telephone,
                r.ID_Reservation,
                r.Price_Reservation
            FROM Active_Rentals ar
            JOIN Client c ON ar.ID_Client = c.ID_Client
            JOIN reservations r ON ar.ID_Reservation = r.ID_Reservation
            WHERE ar.ID_Car = ?
        `, [id]);

        if (activeRental.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    car: {
                        id: carExists[0].ID_Car,
                        name: carExists[0].Name_Car,
                        brand: carExists[0].Marque_Car,
                        model: carExists[0].Modele_Car
                    },
                    currentRenter: null,
                    status: 'available'
                }
            });
        }

        const rental = activeRental[0];

        // Calculate rental duration and days remaining
        const startDate = new Date(rental.Start_Date);
        const endDate = new Date(rental.End_Date);
        const currentDate = new Date();

        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
        const isOverdue = daysRemaining < 0;

        res.status(200).json({
            success: true,
            data: {
                car: {
                    id: carExists[0].ID_Car,
                    name: carExists[0].Name_Car,
                    brand: carExists[0].Marque_Car,
                    model: carExists[0].Modele_Car
                },
                currentRenter: {
                    id: rental.ID_Client,
                    firstName: rental.Prenom_Client,
                    lastName: rental.Nom_Client,
                    email: rental.Email_Client,
                    phone: rental.Numero_Telephone,
                    emergencyContact: rental.Emergency_Contact
                },
                rental: {
                    id: rental.ID_Active_Rental,
                    reservationId: rental.ID_Reservation,
                    startDate: rental.Start_Date,
                    endDate: rental.End_Date,
                    actualPickupTime: rental.Actual_Pickup_Time,
                    expectedReturnTime: rental.Expected_Return_Time,
                    currentMileage: rental.Current_Mileage,
                    totalPrice: rental.Price_Reservation,
                    securityDeposit: {
                        amount: rental.Security_Deposit_Amount,
                        status: rental.Security_Deposit_Status
                    },
                    status: rental.Rental_Status,
                    specialInstructions: rental.Special_Instructions,
                    duration: {
                        totalDays,
                        daysRemaining,
                        isOverdue
                    },
                    createdAt: rental.Created_At
                },
                status: isOverdue ? 'overdue' : 'rented'
            }
        });

    } catch (error) {
        console.error('Error fetching current renter:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Create a new active rental from an existing confirmed reservation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createRental(req, res) {
    try {
        const { id } = req.params;
        const {
            reservationId,
            currentMileage,
            securityDepositAmount,
            emergencyContact,
            specialInstructions
        } = req.body;
        const clientId = req.user.id;
        const userRole = req.user.role;

        // Validation
        if (!reservationId) {
            return res.status(400).json({
                success: false,
                message: 'Reservation ID is required'
            });
        }

        // Get reservation details and validate
        const [reservation] = await database.query(`
            SELECT 
                r.ID_Reservation,
                r.ID_Client,
                r.ID_Car,
                r.Status,
                r.Date_Start_Reservation,
                r.Date_End_Reservation,
                r.Price_Reservation,
                c.ID_Seller,
                car.Name_Car,
                car.Marque_Car,
                car.Modele_Car
            FROM reservations r
            JOIN Car c ON r.ID_Car = c.ID_Car
            JOIN Car car ON r.ID_Car = car.ID_Car
            WHERE r.ID_Reservation = ? AND r.ID_Car = ?
        `, [reservationId, id]);

        if (reservation.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        const reservationData = reservation[0];

        // Authorization: Only car owner or admin can create active rentals
        if (reservationData.ID_Seller !== clientId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only car owner can activate rentals'
            });
        }

        // Check reservation status
        if (reservationData.Status !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Only confirmed reservations can be activated'
            });
        }

        // Check if rental already exists for this reservation
        const [existingRental] = await database.query(
            'SELECT ID_Active_Rental FROM Active_Rentals WHERE ID_Reservation = ?',
            [reservationId]
        );

        if (existingRental.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Rental already exists for this reservation'
            });
        }

        // Check date validity
        const today = new Date();
        const startDate = new Date(reservationData.Date_Start_Reservation);

        if (startDate > today) {
            return res.status(400).json({
                success: false,
                message: 'Cannot activate rental before start date'
            });
        }

        // Create active rental
        const [result] = await database.query(`
            INSERT INTO Active_Rentals (
                ID_Reservation, 
                ID_Car, 
                ID_Client, 
                Start_Date, 
                End_Date, 
                Actual_Pickup_Time,
                Expected_Return_Time,
                Current_Mileage, 
                Security_Deposit_Amount, 
                Security_Deposit_Status,
                Rental_Status, 
                Emergency_Contact, 
                Special_Instructions
            ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, 'held', 'picked_up', ?, ?)
        `, [
            reservationId,
            id,
            reservationData.ID_Client,
            reservationData.Date_Start_Reservation,
            reservationData.Date_End_Reservation,
            `${reservationData.Date_End_Reservation} 18:00:00`, // Expected return time
            currentMileage || null,
            securityDepositAmount || 0,
            emergencyContact || null,
            specialInstructions || null
        ]);

        // Update reservation status to active
        await database.query(
            'UPDATE reservations SET Status = ? WHERE ID_Reservation = ?',
            ['active', reservationId]
        );

        // Update car availability to rented
        await database.query(`
            UPDATE Car_Availability 
            SET Status = 'rented' 
            WHERE ID_Car = ? 
            AND Date_Start_Available <= ? 
            AND Date_End_Available >= ?
        `, [id, reservationData.Date_End_Reservation, reservationData.Date_Start_Reservation]);

        // Get created rental with full details
        const [newRental] = await database.query(`
            SELECT 
                ar.*,
                c.Nom_Client,
                c.Prenom_Client,
                c.Email_Client,
                c.Numero_Telephone
            FROM Active_Rentals ar
            JOIN Client c ON ar.ID_Client = c.ID_Client
            WHERE ar.ID_Active_Rental = ?
        `, [result.insertId]);

        const rental = newRental[0];

        res.status(201).json({
            success: true,
            message: 'Rental activated successfully',
            data: {
                id: rental.ID_Active_Rental,
                reservationId: rental.ID_Reservation,
                car: {
                    id: reservationData.ID_Car,
                    name: reservationData.Name_Car,
                    brand: reservationData.Marque_Car,
                    model: reservationData.Modele_Car
                },
                renter: {
                    id: rental.ID_Client,
                    firstName: rental.Nom_Client,
                    lastName: rental.Prenom_Client,
                    email: rental.Email_Client,
                    phone: rental.Numero_Telephone
                },
                startDate: rental.Start_Date,
                endDate: rental.End_Date,
                actualPickupTime: rental.Actual_Pickup_Time,
                expectedReturnTime: rental.Expected_Return_Time,
                currentMileage: rental.Current_Mileage,
                securityDeposit: {
                    amount: rental.Security_Deposit_Amount,
                    status: rental.Security_Deposit_Status
                },
                status: rental.Rental_Status,
                emergencyContact: rental.Emergency_Contact,
                specialInstructions: rental.Special_Instructions,
                createdAt: rental.Created_At
            }
        });

    } catch (error) {
        console.error('Error creating rental:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Update an active rental
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateRental(req, res) {
    try {
        const { id } = req.params;
        const {
            rentalId,
            status,
            currentMileage,
            securityDepositStatus,
            emergencyContact,
            specialInstructions,
            returnMileage
        } = req.body;
        const clientId = req.user.id;
        const userRole = req.user.role;

        if (!rentalId) {
            return res.status(400).json({
                success: false,
                message: 'Rental ID is required'
            });
        }

        // Get existing rental
        const [existingRental] = await database.query(`
            SELECT 
                ar.*,
                c.ID_Seller,
                r.Status as ReservationStatus
            FROM Active_Rentals ar
            JOIN Car c ON ar.ID_Car = c.ID_Car
            JOIN reservations r ON ar.ID_Reservation = r.ID_Reservation
            WHERE ar.ID_Active_Rental = ? AND ar.ID_Car = ?
        `, [rentalId, id]);

        if (existingRental.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Active rental not found'
            });
        }

        const rental = existingRental[0];

        // Authorization check
        const isRenter = rental.ID_Client === clientId;
        const isCarOwner = rental.ID_Seller === clientId;
        const isAdmin = userRole === 'admin';

        if (!isRenter && !isCarOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this rental'
            });
        }

        // Status validation
        if (status) {
            const validStatusTransitions = {
                'picked_up': ['in_use', 'returning'],
                'in_use': ['returning', 'overdue'],
                'overdue': ['returning'],
                'returning': []
            };

            const allowedStatuses = validStatusTransitions[rental.Rental_Status] || [];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot change rental status from ${rental.Rental_Status} to ${status}`
                });
            }

            // Only car owner can mark as returning
            if (status === 'returning' && !isCarOwner && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Only car owner can mark rental as returning'
                });
            }
        }

        // Build update query
        const updateFields = [];
        const updateValues = [];

        if (status) {
            updateFields.push('Rental_Status = ?');
            updateValues.push(status);
        }

        if (currentMileage !== undefined) {
            updateFields.push('Current_Mileage = ?');
            updateValues.push(currentMileage);
        }

        if (securityDepositStatus) {
            updateFields.push('Security_Deposit_Status = ?');
            updateValues.push(securityDepositStatus);
        }

        if (emergencyContact !== undefined) {
            updateFields.push('Emergency_Contact = ?');
            updateValues.push(emergencyContact);
        }

        if (specialInstructions !== undefined) {
            updateFields.push('Special_Instructions = ?');
            updateValues.push(specialInstructions);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateValues.push(rentalId);

        // Update rental
        await database.query(
            `UPDATE Active_Rentals SET ${updateFields.join(', ')} WHERE ID_Active_Rental = ?`,
            updateValues
        );

        // Handle status-specific actions
        if (status === 'returning') {
            // Optionally create a return record or update reservation
            await database.query(
                'UPDATE reservations SET Status = ? WHERE ID_Reservation = ?',
                ['completed', rental.ID_Reservation]
            );

            // Update car availability back to available
            await database.query(`
                UPDATE Car_Availability 
                SET Status = 'available' 
                WHERE ID_Car = ? 
                AND Date_Start_Available <= ? 
                AND Date_End_Available >= ?
            `, [id, rental.End_Date, rental.Start_Date]);
        }

        // Get updated rental
        const [updatedRental] = await database.query(`
            SELECT 
                ar.*,
                c.Nom_Client,
                c.Prenom_Client,
                c.Email_Client,
                car.Name_Car,
                car.Marque_Car,
                car.Modele_Car
            FROM Active_Rentals ar
            JOIN Client c ON ar.ID_Client = c.ID_Client
            JOIN Car car ON ar.ID_Car = car.ID_Car
            WHERE ar.ID_Active_Rental = ?
        `, [rentalId]);

        const updated = updatedRental[0];

        res.status(200).json({
            success: true,
            message: 'Rental updated successfully',
            data: {
                id: updated.ID_Active_Rental,
                reservationId: updated.ID_Reservation,
                car: {
                    id: updated.ID_Car,
                    name: updated.Name_Car,
                    brand: updated.Marque_Car,
                    model: updated.Modele_Car
                },
                renter: {
                    id: updated.ID_Client,
                    firstName: updated.Nom_Client,
                    lastName: updated.Prenom_Client,
                    email: updated.Email_Client
                },
                startDate: updated.Start_Date,
                endDate: updated.End_Date,
                actualPickupTime: updated.Actual_Pickup_Time,
                expectedReturnTime: updated.Expected_Return_Time,
                currentMileage: updated.Current_Mileage,
                securityDeposit: {
                    amount: updated.Security_Deposit_Amount,
                    status: updated.Security_Deposit_Status
                },
                status: updated.Rental_Status,
                emergencyContact: updated.Emergency_Contact,
                specialInstructions: updated.Special_Instructions,
                updatedAt: updated.Updated_At
            }
        });

    } catch (error) {
        console.error('Error updating rental:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Delete/Complete an active rental
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteRental(req, res) {
    try {
        const { id } = req.params;
        const { rentalId, finalMileage, damageNotes } = req.body;
        const clientId = req.user.id;
        const userRole = req.user.role;

        if (!rentalId) {
            return res.status(400).json({
                success: false,
                message: 'Rental ID is required'
            });
        }

        // Get rental details
        const [existingRental] = await database.query(`
            SELECT 
                ar.*,
                c.ID_Seller,
                r.Status as ReservationStatus,
                r.Price_Reservation
            FROM Active_Rentals ar
            JOIN Car c ON ar.ID_Car = c.ID_Car
            JOIN reservations r ON ar.ID_Reservation = r.ID_Reservation
            WHERE ar.ID_Active_Rental = ? AND ar.ID_Car = ?
        `, [rentalId, id]);

        if (existingRental.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Active rental not found'
            });
        }

        const rental = existingRental[0];

        // Authorization: Only car owner or admin can complete rentals
        if (rental.ID_Seller !== clientId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only car owner can complete rentals'
            });
        }

        // Validate rental can be completed
        if (rental.Rental_Status === 'picked_up') {
            return res.status(400).json({
                success: false,
                message: 'Cannot complete rental that has not been returned'
            });
        }

        // Update final details before completion
        if (finalMileage) {
            await database.query(
                'UPDATE Active_Rentals SET Current_Mileage = ? WHERE ID_Active_Rental = ?',
                [finalMileage, rentalId]
            );
        }

        // Update reservation to completed
        await database.query(
            'UPDATE reservations SET Status = ? WHERE ID_Reservation = ?',
            ['completed', rental.ID_Reservation]
        );

        // Release security deposit (assuming no damages)
        await database.query(
            'UPDATE Active_Rentals SET Security_Deposit_Status = ? WHERE ID_Active_Rental = ?',
            ['released', rentalId]
        );

        // Create transaction record for completed rental
        await database.query(`
            INSERT INTO Transaction 
            (Name_Transaction, Description_Transaction, Prix_Transaction, ID_Acheteur, ID_Vendeur) 
            VALUES (?, ?, ?, ?, ?)
        `, [
            'Car Rental Payment',
            `Completed rental for car ID ${id}`,
            rental.Price_Reservation,
            rental.ID_Client,
            rental.ID_Seller
        ]);

        // Update car availability back to available
        await database.query(`
            UPDATE Car_Availability 
            SET Status = 'available' 
            WHERE ID_Car = ? 
            AND Date_Start_Available <= ? 
            AND Date_End_Available >= ?
        `, [id, rental.End_Date, rental.Start_Date]);

        // Remove from active rentals
        await database.query('DELETE FROM Active_Rentals WHERE ID_Active_Rental = ?', [rentalId]);

        res.status(200).json({
            success: true,
            message: 'Rental completed successfully',
            data: {
                completedAt: new Date(),
                finalMileage: finalMileage || rental.Current_Mileage,
                securityDepositStatus: 'released',
                transactionCreated: true
            }
        });

    } catch (error) {
        console.error('Error completing rental:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    getRenter,
    createRental,
    updateRental,
    deleteRental
};