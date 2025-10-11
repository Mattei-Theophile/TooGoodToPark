const database = require("../../database/database");

/**
 * Get reservations for a specific car or user's reservations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getReservation(req, res) {
    try {
        const { id } = req.params;
        const clientId = req.user.id;
        const userRole = req.user.role;
        const {
            page = 1,
            limit = 10,
            status,
            startDate,
            endDate,
            sortBy = 'Created_At',
            order = 'DESC'
        } = req.query;

        const conn = new database.Database().connect();
        // Validate car exists
        const [carExists] = await conn.promise().query(
            'SELECT ID_Car, ID_Seller FROM Car WHERE ID_Car = ?',
            [id]
        );



        if (carExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        const carOwnerId = carExists[0].ID_Seller;

        // Build query conditions
        let whereConditions = ['r.ID_Car = ?'];
        let queryParams = [id];

        // Access control: Users can only see their own reservations unless they're the car owner or admin
        if (userRole !== 'admin' && clientId !== carOwnerId) {
            whereConditions.push('r.ID_Client = ?');
            queryParams.push(clientId);
        }

        // Status filter
        if (status) {
            whereConditions.push('r.Status = ?');
            queryParams.push(status);
        }

        // Date range filter
        if (startDate) {
            whereConditions.push('r.Date_Start_Reservation >= ?');
            queryParams.push(startDate);
        }

        if (endDate) {
            whereConditions.push('r.Date_End_Reservation <= ?');
            queryParams.push(endDate);
        }

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Get reservations with client and car information
        const [reservations] = await conn.promise().query(`
            SELECT 
                r.ID_Reservation,
                r.Price_Reservation,
                r.Date_Start_Reservation,
                r.Date_End_Reservation,
                r.Status,
                r.Created_At,
                c.Nom_Client,
                c.Prenom_Client,
                c.Email_Client,
                c.Numero_Telephone,
                car.Name_Car,
                car.Marque_Car,
                car.Modele_Car,
                car.Prix_Car,
                ar.Rental_Status,
                ar.Actual_Pickup_Time,
                ar.Expected_Return_Time
            FROM reservations r
            JOIN Client c ON r.ID_Client = c.ID_Client
            JOIN Car car ON r.ID_Car = car.ID_Car
            LEFT JOIN Active_Rentals ar ON r.ID_Reservation = ar.ID_Reservation
            WHERE ${whereConditions.join(' AND ')}
            ORDER BY r.${sortBy} ${order}
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), parseInt(offset)]);

        // Get total count for pagination
        const [countResult] = await database.query(`
            SELECT COUNT(*) as total 
            FROM reservations r
            WHERE ${whereConditions.join(' AND ')}
        `, queryParams);

        const totalReservations = countResult[0].total;

        // Format response
        const formattedReservations = reservations.map(reservation => ({
            id: reservation.ID_Reservation,
            price: reservation.Price_Reservation,
            startDate: reservation.Date_Start_Reservation,
            endDate: reservation.Date_End_Reservation,
            status: reservation.Status,
            createdAt: reservation.Created_At,
            client: {
                firstName: reservation.Prenom_Client,
                lastName: reservation.Nom_Client,
                email: reservation.Email_Client,
                phone: reservation.Numero_Telephone
            },
            car: {
                name: reservation.Name_Car,
                brand: reservation.Marque_Car,
                model: reservation.Modele_Car,
                pricePerDay: reservation.Prix_Car
            },
            rental: reservation.Rental_Status ? {
                status: reservation.Rental_Status,
                actualPickupTime: reservation.Actual_Pickup_Time,
                expectedReturnTime: reservation.Expected_Return_Time
            } : null
        }));

        res.status(200).json({
            success: true,
            data: {
                reservations: formattedReservations,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReservations / limit),
                    totalReservations,
                    hasNext: (page * limit) < totalReservations,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Get all reservations for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getReservationsByUser(req, res) {
    try {
        const { userId } = req.params;
        const requestingClientId = req.user.id;
        const userRole = req.user.role;
        const {
            page = 1,
            limit = 10,
            status,
            startDate,
            endDate,
            sortBy = 'Created_At',
            order = 'DESC',
            carId,
            includeCompleted = true
        } = req.query;
        const conn = new database.Database().connect();

        // Authorization: Users can only see their own reservations unless they're admin
        // or car owners viewing reservations for their cars
        if (userRole !== 'admin' && parseInt(userId) !== requestingClientId) {
            // Check if requesting user is a car owner for any of the target user's reservations
            const [ownershipCheck] = await conn.promise().query(`
                SELECT COUNT(*) as count
                FROM reservations r
                JOIN Car c ON r.ID_Car = c.ID_Car
                WHERE r.ID_Client = ? AND c.ID_Seller = ?
            `, [userId, requestingClientId]);

            if (ownershipCheck[0].count === 0) {
                conn.end();
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to view these reservations'
                });
            }
        }

        // Validate user exists
        const [userExists] = await conn.promise().query(
            'SELECT ID_Client, Nom_Client, Prenom_Client, Email_Client FROM Client WHERE ID_Client = ?',
            [userId]
        );
        if (userExists.length === 0) {
            conn.end();
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = userExists[0];

        // Build query conditions
        let whereConditions = ['r.ID_Client = ?'];
        let queryParams = [userId];

        // Status filter
        if (status) {
            whereConditions.push('r.Status = ?');
            queryParams.push(status);
        }

        // Exclude completed reservations if requested
        if (!includeCompleted || includeCompleted === 'false') {
            whereConditions.push('r.Status != ?');
            queryParams.push('completed');
        }

        // Date range filter
        if (startDate) {
            whereConditions.push('r.Date_Start_Reservation >= ?');
            queryParams.push(startDate);
        }

        if (endDate) {
            whereConditions.push('r.Date_End_Reservation <= ?');
            queryParams.push(endDate);
        }

        // Car filter
        if (carId) {
            whereConditions.push('r.ID_Car = ?');
            queryParams.push(carId);
        }

        // If requesting user is not admin and not the target user,
        // only show reservations for cars they own
        if (userRole !== 'admin' && parseInt(userId) !== requestingClientId) {
            whereConditions.push('car.ID_Seller = ?');
            queryParams.push(requestingClientId);
        }

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Get reservations with car and owner information
        const [reservations] = await conn.promise().query(`
            SELECT 
                r.ID_Reservation,
                r.Price_Reservation,
                r.Date_Start_Reservation,
                r.Date_End_Reservation,
                r.Status,
                r.Created_At,
                r.Updated_At,
                car.ID_Car,
                car.Name_Car,
                car.Marque_Car,
                car.Modele_Car,
                car.Prix_Car,
                car.Description_Car,
                CONCAT(owner.Prenom_Client, ' ', owner.Nom_Client) as Car_Owner_Name,
                owner.Email_Client as Car_Owner_Email,
                owner.Numero_Telephone as Car_Owner_Phone,
                ar.Rental_Status,
                ar.Actual_Pickup_Time,
                ar.Expected_Return_Time,
                ar.Current_Mileage,
                ar.Security_Deposit_Amount,
                ar.Security_Deposit_Status
            FROM reservations r
            JOIN Car car ON r.ID_Car = car.ID_Car
            JOIN Client owner ON car.ID_Seller = owner.ID_Client
            LEFT JOIN Active_Rentals ar ON r.ID_Reservation = ar.ID_Reservation
            WHERE ${whereConditions.join(' AND ')}
            ORDER BY r.${sortBy} ${order}
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), parseInt(offset)]);

        // Get total count for pagination
        const [countResult] = await conn.promise().query(`
            SELECT COUNT(*) as total 
            FROM reservations r
            JOIN Car car ON r.ID_Car = car.ID_Car
            WHERE ${whereConditions.join(' AND ')}
        `, queryParams);

        const totalReservations = countResult[0].total;

        // Get reservation statistics
        const [stats] = await conn.promise().query(`
            SELECT 
                COUNT(*) as total_reservations,
                SUM(CASE WHEN Status = 'pending' THEN 1 ELSE 0 END) as pending_count,
                SUM(CASE WHEN Status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_count,
                SUM(CASE WHEN Status = 'active' THEN 1 ELSE 0 END) as active_count,
                SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) as completed_count,
                SUM(CASE WHEN Status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
                SUM(Price_Reservation) as total_spent,
                AVG(Price_Reservation) as average_booking_value
            FROM reservations r
            JOIN Car car ON r.ID_Car = car.ID_Car
            WHERE ${whereConditions.join(' AND ')}
        `, queryParams);

        conn.end();

        // Format response
        const formattedReservations = reservations.map(reservation => {
            const startDate = new Date(reservation.Date_Start_Reservation);
            const endDate = new Date(reservation.Date_End_Reservation);
            const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const currentDate = new Date();

            let reservationStatus = reservation.Status;
            if (reservation.Status === 'confirmed' && startDate < currentDate) {
                reservationStatus = 'overdue_start';
            }
            if (reservation.Status === 'active' && endDate < currentDate) {
                reservationStatus = 'overdue_return';
            }

            return {
                id: reservation.ID_Reservation,
                price: reservation.Price_Reservation,
                startDate: reservation.Date_Start_Reservation,
                endDate: reservation.Date_End_Reservation,
                status: reservationStatus,
                originalStatus: reservation.Status,
                totalDays: totalDays,
                createdAt: reservation.Created_At,
                updatedAt: reservation.Updated_At,
                car: {
                    id: reservation.ID_Car,
                    name: reservation.Name_Car,
                    brand: reservation.Marque_Car,
                    model: reservation.Modele_Car,
                    pricePerDay: reservation.Prix_Car,
                    description: reservation.Description_Car,
                    owner: {
                        name: reservation.Car_Owner_Name,
                        email: reservation.Car_Owner_Email,
                        phone: reservation.Car_Owner_Phone
                    }
                },
                rental: reservation.Rental_Status ? {
                    status: reservation.Rental_Status,
                    actualPickupTime: reservation.Actual_Pickup_Time,
                    expectedReturnTime: reservation.Expected_Return_Time,
                    currentMileage: reservation.Current_Mileage,
                    securityDeposit: {
                        amount: reservation.Security_Deposit_Amount,
                        status: reservation.Security_Deposit_Status
                    }
                } : null
            };
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.ID_Client,
                    firstName: user.Prenom_Client,
                    lastName: user.Nom_Client,
                    email: user.Email_Client
                },
                reservations: formattedReservations,
                statistics: {
                    totalReservations: stats[0].total_reservations,
                    statusBreakdown: {
                        pending: stats[0].pending_count,
                        confirmed: stats[0].confirmed_count,
                        active: stats[0].active_count,
                        completed: stats[0].completed_count,
                        cancelled: stats[0].cancelled_count
                    },
                    totalSpent: parseFloat(stats[0].total_spent || 0).toFixed(2),
                    averageBookingValue: parseFloat(stats[0].average_booking_value || 0).toFixed(2)
                },
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReservations / limit),
                    totalReservations,
                    hasNext: (page * limit) < totalReservations,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


/**
 * Get current user's reservations (shortcut function)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getMyReservations(req, res) {
    try {
        // Set the userId parameter to the authenticated user's ID
        req.params.userId = req.user.id;

        // Call the main function
        return await getReservationsByUser(req, res);

    } catch (error) {
        console.error('Error fetching my reservations:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Create a new reservation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createReservation(req, res) {
    try {
        const { id } = req.params;
        const { startDate, endDate, emergencyContact, specialInstructions } = req.body;
        const clientId = req.user.id;

        // Validation
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be in the past'
            });
        }

        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        // Check if car exists and get price
        const [carResult] = await database.query(
            'SELECT ID_Car, Prix_Car, ID_Seller FROM Car WHERE ID_Car = ?',
            [id]
        );

        if (carResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        const car = carResult[0];

        // Prevent self-booking
        if (car.ID_Seller === clientId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot book your own car'
            });
        }

        // Check car availability for the requested dates
        const [conflictingReservations] = await database.query(`
            SELECT ID_Reservation 
            FROM reservations 
            WHERE ID_Car = ? 
            AND Status IN ('pending', 'confirmed', 'active')
            AND (
                (Date_Start_Reservation <= ? AND Date_End_Reservation > ?) OR
                (Date_Start_Reservation < ? AND Date_End_Reservation >= ?) OR
                (Date_Start_Reservation >= ? AND Date_End_Reservation <= ?)
            )
        `, [id, startDate, startDate, endDate, endDate, startDate, endDate]);

        if (conflictingReservations.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Car is not available for the selected dates'
            });
        }

        // Calculate total price
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * car.Prix_Car;

        // Create reservation
        const [result] = await database.query(`
            INSERT INTO reservations 
            (ID_Client, ID_Car, Price_Reservation, Date_Start_Reservation, Date_End_Reservation, Status) 
            VALUES (?, ?, ?, ?, ?, 'pending')
        `, [clientId, id, totalPrice, startDate, endDate]);

        const reservationId = result.insertId;

        // Get the created reservation with full details
        const [newReservation] = await database.query(`
            SELECT 
                r.ID_Reservation,
                r.Price_Reservation,
                r.Date_Start_Reservation,
                r.Date_End_Reservation,
                r.Status,
                r.Created_At,
                c.Nom_Client,
                c.Prenom_Client,
                c.Email_Client,
                car.Name_Car,
                car.Marque_Car,
                car.Modele_Car
            FROM reservations r
            JOIN Client c ON r.ID_Client = c.ID_Client
            JOIN Car car ON r.ID_Car = car.ID_Car
            WHERE r.ID_Reservation = ?
        `, [reservationId]);

        // Update car availability status
        await database.query(`
            UPDATE Car_Availability 
            SET Status = 'reserved' 
            WHERE ID_Car = ? 
            AND Date_Start_Available <= ? 
            AND Date_End_Available >= ?
        `, [id, endDate, startDate]);

        res.status(201).json({
            success: true,
            message: 'Reservation created successfully',
            data: {
                id: newReservation[0].ID_Reservation,
                price: newReservation[0].Price_Reservation,
                startDate: newReservation[0].Date_Start_Reservation,
                endDate: newReservation[0].Date_End_Reservation,
                status: newReservation[0].Status,
                createdAt: newReservation[0].Created_At,
                totalDays: days,
                client: {
                    firstName: newReservation[0].Prenom_Client,
                    lastName: newReservation[0].Nom_Client,
                    email: newReservation[0].Email_Client
                },
                car: {
                    name: newReservation[0].Name_Car,
                    brand: newReservation[0].Marque_Car,
                    model: newReservation[0].Modele_Car
                }
            }
        });

    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Update an existing reservation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateReservation(req, res) {
    try {
        const { id } = req.params;
        const { reservationId, status, startDate, endDate } = req.body;
        const clientId = req.user.id;
        const userRole = req.user.role;

        if (!reservationId) {
            return res.status(400).json({
                success: false,
                message: 'Reservation ID is required'
            });
        }

        // Get existing reservation
        const [existingReservation] = await database.query(`
            SELECT 
                r.ID_Reservation, 
                r.ID_Client, 
                r.Status,
                r.Date_Start_Reservation,
                r.Date_End_Reservation,
                c.ID_Seller
            FROM reservations r
            JOIN Car c ON r.ID_Car = c.ID_Car
            WHERE r.ID_Reservation = ? AND r.ID_Car = ?
        `, [reservationId, id]);

        if (existingReservation.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        const reservation = existingReservation[0];
        const isOwner = reservation.ID_Client === clientId;
        const isCarOwner = reservation.ID_Seller === clientId;
        const isAdmin = userRole === 'admin';

        // Authorization check
        if (!isOwner && !isCarOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this reservation'
            });
        }

        // Status update logic
        if (status) {
            const validStatusTransitions = {
                'pending': ['confirmed', 'cancelled'],
                'confirmed': ['active', 'cancelled'],
                'active': ['completed'],
                'completed': [],
                'cancelled': []
            };

            const allowedStatuses = validStatusTransitions[reservation.Status] || [];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot change status from ${reservation.Status} to ${status}`
                });
            }

            // Additional authorization for status changes
            if (status === 'confirmed' && !isCarOwner && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Only car owner can confirm reservations'
                });
            }

            if (status === 'cancelled' && reservation.Status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot cancel active reservation'
                });
            }
        }

        // Date validation for updates
        if (startDate || endDate) {
            const newStartDate = startDate || reservation.Date_Start_Reservation;
            const newEndDate = endDate || reservation.Date_End_Reservation;

            if (reservation.Status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot modify dates of active reservation'
                });
            }

            // Check availability for new dates
            if (startDate || endDate) {
                const [conflicts] = await database.query(`
                    SELECT ID_Reservation 
                    FROM reservations 
                    WHERE ID_Car = ? 
                    AND ID_Reservation != ?
                    AND Status IN ('pending', 'confirmed', 'active')
                    AND (
                        (Date_Start_Reservation <= ? AND Date_End_Reservation > ?) OR
                        (Date_Start_Reservation < ? AND Date_End_Reservation >= ?) OR
                        (Date_Start_Reservation >= ? AND Date_End_Reservation <= ?)
                    )
                `, [id, reservationId, newStartDate, newStartDate, newEndDate, newEndDate, newStartDate, newEndDate]);

                if (conflicts.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: 'Car is not available for the selected dates'
                    });
                }
            }
        }

        // Build update query
        const updateFields = [];
        const updateValues = [];

        if (status) {
            updateFields.push('Status = ?');
            updateValues.push(status);
        }

        if (startDate) {
            updateFields.push('Date_Start_Reservation = ?');
            updateValues.push(startDate);
        }

        if (endDate) {
            updateFields.push('Date_End_Reservation = ?');
            updateValues.push(endDate);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateValues.push(reservationId);

        // Update reservation
        await database.query(
            `UPDATE reservations SET ${updateFields.join(', ')} WHERE ID_Reservation = ?`,
            updateValues
        );

        // Handle status-specific actions
        if (status === 'active') {
            // Create active rental record
            const [carPrice] = await database.query('SELECT Prix_Car FROM Car WHERE ID_Car = ?', [id]);

            await database.query(`
                INSERT INTO Active_Rentals 
                (ID_Reservation, ID_Car, ID_Client, Start_Date, End_Date, Actual_Pickup_Time)
                VALUES (?, ?, ?, ?, ?, NOW())
            `, [reservationId, id, reservation.ID_Client, startDate || reservation.Date_Start_Reservation, endDate || reservation.Date_End_Reservation]);
        }

        if (status === 'completed') {
            // Remove from active rentals
            await database.query('DELETE FROM Active_Rentals WHERE ID_Reservation = ?', [reservationId]);
        }

        if (status === 'cancelled') {
            // Update car availability back to available
            await database.query(`
                UPDATE Car_Availability 
                SET Status = 'available' 
                WHERE ID_Car = ? 
                AND Date_Start_Available <= ? 
                AND Date_End_Available >= ?
            `, [id, reservation.Date_End_Reservation, reservation.Date_Start_Reservation]);
        }

        // Get updated reservation
        const [updatedReservation] = await database.query(`
            SELECT 
                r.ID_Reservation,
                r.Price_Reservation,
                r.Date_Start_Reservation,
                r.Date_End_Reservation,
                r.Status,
                r.Created_At,
                c.Nom_Client,
                c.Prenom_Client,
                car.Name_Car,
                car.Marque_Car,
                car.Modele_Car
            FROM reservations r
            JOIN Client c ON r.ID_Client = c.ID_Client
            JOIN Car car ON r.ID_Car = car.ID_Car
            WHERE r.ID_Reservation = ?
        `, [reservationId]);

        res.status(200).json({
            success: true,
            message: 'Reservation updated successfully',
            data: {
                id: updatedReservation[0].ID_Reservation,
                price: updatedReservation[0].Price_Reservation,
                startDate: updatedReservation[0].Date_Start_Reservation,
                endDate: updatedReservation[0].Date_End_Reservation,
                status: updatedReservation[0].Status,
                createdAt: updatedReservation[0].Created_At,
                client: {
                    firstName: updatedReservation[0].Prenom_Client,
                    lastName: updatedReservation[0].Nom_Client
                },
                car: {
                    name: updatedReservation[0].Name_Car,
                    brand: updatedReservation[0].Marque_Car,
                    model: updatedReservation[0].Modele_Car
                }
            }
        });

    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Delete/Cancel a reservation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteReservation(req, res) {
    try {
        const { id } = req.params;
        const { reservationId } = req.body;
        const clientId = req.user.id;
        const userRole = req.user.role;

        if (!reservationId) {
            return res.status(400).json({
                success: false,
                message: 'Reservation ID is required'
            });
        }

        // Get reservation details
        const [existingReservation] = await database.query(`
            SELECT 
                r.ID_Reservation, 
                r.ID_Client, 
                r.Status,
                r.Date_Start_Reservation,
                r.Date_End_Reservation,
                c.ID_Seller
            FROM reservations r
            JOIN Car c ON r.ID_Car = c.ID_Car
            WHERE r.ID_Reservation = ? AND r.ID_Car = ?
        `, [reservationId, id]);

        if (existingReservation.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        const reservation = existingReservation[0];
        const isOwner = reservation.ID_Client === clientId;
        const isCarOwner = reservation.ID_Seller === clientId;
        const isAdmin = userRole === 'admin';

        // Authorization check
        if (!isOwner && !isCarOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this reservation'
            });
        }

        // Business rules for deletion
        if (reservation.Status === 'active') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete active reservation. Please complete it first.'
            });
        }

        if (reservation.Status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete completed reservation for record keeping.'
            });
        }

        // Remove from active rentals if exists
        await database.query('DELETE FROM Active_Rentals WHERE ID_Reservation = ?', [reservationId]);

        // Update car availability back to available
        await database.query(`
            UPDATE Car_Availability 
            SET Status = 'available' 
            WHERE ID_Car = ? 
            AND Date_Start_Available <= ? 
            AND Date_End_Available >= ?
        `, [id, reservation.Date_End_Reservation, reservation.Date_Start_Reservation]);

        // Delete reservation
        await database.query('DELETE FROM reservations WHERE ID_Reservation = ?', [reservationId]);

        res.status(200).json({
            success: true,
            message: 'Reservation deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    getReservation,
    getReservationsByUser,
    getMyReservations,
    createReservation,
    updateReservation,
    deleteReservation
};