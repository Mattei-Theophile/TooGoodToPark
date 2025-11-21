const database = require("../../database/database");
const { Database } = require("../../database/database");
/**
 * @swagger
 * /cars/{carId}/reservations:
 *   get:
 *     summary: Get reservations for a specific car
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by reservation status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reservations from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reservations until this date
 *     responses:
 *       200:
 *         description: Car reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /cars/reservations:
 *   post:
 *     summary: Create a new car reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ID_Car, startDate, endDate]
 *             properties:
 *               ID_Car:
 *                 type: integer
 *                 description: Car ID to reserve
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Reservation start date and time
 *                 example: "2024-12-01T10:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Reservation end date and time
 *                 example: "2024-12-05T18:00:00Z"
 *
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Reservation created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid reservation data or car unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Car not available for selected dates
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update an existing reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reservationId]
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: Reservation ID to update
 *               ID_Car:
 *                 type: integer
 *                 description: Car ID (if changing car)
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: New start date and time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: New end date and time
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 description: Reservation status
 *
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid update data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Can only update own reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete/cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reservationId]
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: Reservation ID to delete
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Can only cancel own reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /users/{userId}/reservations:
 *   get:
 *     summary: Get reservations for a specific user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by reservation status
 *     responses:
 *       200:
 *         description: User reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Can only view own reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /cars/myreservations:
 *   get:
 *     summary: Get current user's reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by reservation status
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         description: Show only upcoming reservations
 *     responses:
 *       200:
 *         description: User's reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * Fetches reservation details based on provided query parameters and car ID.
 *
 * @param {Object} req - The HTTP request object containing parameters and query values.
 * @param {Object} req.params - Parameters from the route, including the car ID.
 * @param {string} req.params.id - The ID of the car for which reservations are retrieved.
 * @param {Object} req.query - Query parameters for filtering, sorting, and pagination.
 * @param {number} [req.query.page=1] - The current page for pagination.
 * @param {number} [req.query.limit=10] - Number of records per page.
 * @param {string} [req.query.status] - Filter by reservation status.
 * @param {string} [req.query.startDate] - Filter by start date range.
 * @param {string} [req.query.endDate] - Filter by end date range.
 * @param {string} [req.query.sortBy='Created_At'] - Field by which results should be sorted.
 * @param {string} [req.query.order='DESC'] - Sorting order, either 'ASC' or 'DESC'.
 * @param {Object} res - The HTTP response object used to return the result.
 * @return {Promise<void>} Returns a response containing reservation details with client, car, and rental information, pagination metadata, or an error status if the operation fails.
 */
async function getReservation(req, res) {
  try {
    const { id } = req.params;
    console.log("reservations");
    console.log(req.params);
    console.log(req.params.id);
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
      sortBy = "Created_At",
      order = "DESC",
    } = req.query;

    const conn = new database.Database().connect();
    // Validate car exists
    const [carExists] = await conn
      .promise()
      .query("SELECT ID_Car, ID_Seller FROM Car WHERE ID_Car = ?", [id]);

    if (carExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    const carOwnerId = carExists[0].ID_Seller;

    // Build query conditions
    let whereConditions = ["r.ID_Car = ?"];
    let queryParams = [id];

    // Status filter
    if (status) {
      whereConditions.push("r.Status = ?");
      queryParams.push(status);
    }

    // Date range filter
    if (startDate) {
      whereConditions.push("r.Date_Start_Reservation >= ?");
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push("r.Date_End_Reservation <= ?");
      queryParams.push(endDate);
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get reservations with client and car information
    const [reservations] = await conn.promise().query(
      `
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
                car.Price_Car,
                ar.Rental_Status,
                ar.Actual_Pickup_Time,
                ar.Expected_Return_Time
            FROM reservations r
            JOIN Client c ON r.ID_Client = c.ID_Client
            JOIN Car car ON r.ID_Car = car.ID_Car
            LEFT JOIN Active_Rentals ar ON r.ID_Reservation = ar.ID_Reservation
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY r.${sortBy} ${order}
            LIMIT ? OFFSET ?
        `,
      [...queryParams, parseInt(limit), parseInt(offset)],
    );

    // Get total count for pagination
    const [countResult] = await conn.promise().query(
      `
            SELECT COUNT(*) as total 
            FROM reservations r
            WHERE ${whereConditions.join(" AND ")}
        `,
      queryParams,
    );

    const totalReservations = countResult[0].total;

    // Format response
    const formattedReservations = reservations.map((reservation) => ({
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
        phone: reservation.Numero_Telephone,
      },
      car: {
        name: reservation.Name_Car,
        brand: reservation.Marque_Car,
        model: reservation.Modele_Car,
        pricePerDay: reservation.Price_Car,
      },
      rental: reservation.Rental_Status
        ? {
            status: reservation.Rental_Status,
            actualPickupTime: reservation.Actual_Pickup_Time,
            expectedReturnTime: reservation.Expected_Return_Time,
          }
        : null,
    }));

    res.status(200).json({
      success: true,
      data: {
        reservations: formattedReservations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReservations / limit),
          totalReservations,
          hasNext: page * limit < totalReservations,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Fetches a paginated list of reservations made by a specific user, along with associated car and rental details.
 * This method includes authorization checks to ensure users can only access reservations they are permitted to view.
 *
 * @param {Object} req The request object. Contains user authentication and parameters:
 * - `req.params.userId` (string): ID of the user whose reservations are to be fetched.
 * - `req.user.id` (string): Authenticated user's ID.
 * - `req.user.role` (string): Role of the authenticated user (e.g., 'admin', 'user').
 * - `req.query.page` (number): The current page for pagination (default is 1).
 * - `req.query.limit` (number): The maximum number of reservations to return per page (default is 10).
 * - `req.query.status` (string): Filter by reservation status (e.g., 'pending', 'confirmed', etc.).
 * - `req.query.startDate` (string): Filter by reservations starting on or after this date (ISO format).
 * - `req.query.endDate` (string): Filter by reservations ending on or before this date (ISO format).
 * - `req.query.sortBy` (string): Field to sort the reservations by (default is "Created_At").
 * - `req.query.order` (string): Order of sorting, either 'ASC' or 'DESC' (default is 'DESC').
 * - `req.query.carId` (string): Filter by a specific car's ID.
 * - `req.query.includeCompleted` (boolean|string): Whether to include completed reservations (default is true).
 *
 * @param {Object} res The response object. Used to send status codes and data back to the client.
 *
 * @return {Promise<void>} A promise that resolves with the fetched reservations and their metadata.
 * The response contains:
 * - `success` (boolean): Indicates whether the request was successful.
 * - `message` (string): A message indicating the result of the request.
 * - `data` (Object): Contains the reservations, user details, and pagination metadata.
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
      sortBy = "Created_At",
      order = "DESC",
      carId,
      includeCompleted = true,
    } = req.query;
    const conn = new database.Database().connect();

    // Authorization: Users can only see their own reservations unless they're admin
    // or car owners viewing reservations for their cars
    if (userRole !== "admin" && parseInt(userId) !== requestingClientId) {
      // Check if requesting user is a car owner for any of the target user's reservations
      const [ownershipCheck] = await conn.promise().query(
        `
                SELECT COUNT(*) as count
                FROM reservations r
                JOIN Car c ON r.ID_Car = c.ID_Car
                WHERE r.ID_Client = ? AND c.ID_Seller = ?
            `,
        [userId, requestingClientId],
      );

      if (ownershipCheck[0].count === 0) {
        conn.end();
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view these reservations",
        });
      }
    }

    // Validate user exists
    const [userExists] = await conn
      .promise()
      .query(
        "SELECT ID_Client, Nom_Client, Prenom_Client, Email_Client FROM Client WHERE ID_Client = ?",
        [userId],
      );
    if (userExists.length === 0) {
      conn.end();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userExists[0];

    // Build query conditions
    let whereConditions = ["r.ID_Client = ?"];
    let queryParams = [userId];

    // Status filter
    if (status) {
      whereConditions.push("r.Status = ?");
      queryParams.push(status);
    }

    // Exclude completed reservations if requested
    if (!includeCompleted || includeCompleted === "false") {
      whereConditions.push("r.Status != ?");
      queryParams.push("completed");
    }

    // Date range filter
    if (startDate) {
      whereConditions.push("r.Date_Start_Reservation >= ?");
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push("r.Date_End_Reservation <= ?");
      queryParams.push(endDate);
    }

    // Car filter
    if (carId) {
      whereConditions.push("r.ID_Car = ?");
      queryParams.push(carId);
    }

    // If requesting user is not admin and not the target user,
    // only show reservations for cars they own
    if (userRole !== "admin" && parseInt(userId) !== requestingClientId) {
      whereConditions.push("car.ID_Seller = ?");
      queryParams.push(requestingClientId);
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get reservations with car and owner information
    const [reservations] = await conn.promise().query(
      `
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
                car.Price_Car,
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
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY r.${sortBy} ${order}
            LIMIT ? OFFSET ?
        `,
      [...queryParams, parseInt(limit), parseInt(offset)],
    );

    // Get total count for pagination
    const [countResult] = await conn.promise().query(
      `
            SELECT COUNT(*) as total 
            FROM reservations r
            JOIN Car car ON r.ID_Car = car.ID_Car
            WHERE ${whereConditions.join(" AND ")}
        `,
      queryParams,
    );

    const totalReservations = countResult[0].total;

    // Get reservation statistics
    const [stats] = await conn.promise().query(
      `
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
            WHERE ${whereConditions.join(" AND ")}
        `,
      queryParams,
    );

    conn.end();

    // Format response
    const formattedReservations = reservations.map((reservation) => {
      const startDate = new Date(reservation.Date_Start_Reservation);
      const endDate = new Date(reservation.Date_End_Reservation);
      const totalDays = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24),
      );
      const currentDate = new Date();

      let reservationStatus = reservation.Status;
      if (reservation.Status === "confirmed" && startDate < currentDate) {
        reservationStatus = "overdue_start";
      }
      if (reservation.Status === "active" && endDate < currentDate) {
        reservationStatus = "overdue_return";
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
          pricePerDay: reservation.Price_Car,
          description: reservation.Description_Car,
          owner: {
            name: reservation.Car_Owner_Name,
            email: reservation.Car_Owner_Email,
            phone: reservation.Car_Owner_Phone,
          },
        },
        rental: reservation.Rental_Status
          ? {
              status: reservation.Rental_Status,
              actualPickupTime: reservation.Actual_Pickup_Time,
              expectedReturnTime: reservation.Expected_Return_Time,
              currentMileage: reservation.Current_Mileage,
              securityDeposit: {
                amount: reservation.Security_Deposit_Amount,
                status: reservation.Security_Deposit_Status,
              },
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.ID_Client,
          firstName: user.Prenom_Client,
          lastName: user.Nom_Client,
          email: user.Email_Client,
        },
        reservations: formattedReservations,
        statistics: {
          totalReservations: stats[0].total_reservations,
          statusBreakdown: {
            pending: stats[0].pending_count,
            confirmed: stats[0].confirmed_count,
            active: stats[0].active_count,
            completed: stats[0].completed_count,
            cancelled: stats[0].cancelled_count,
          },
          totalSpent: parseFloat(stats[0].total_spent || 0).toFixed(2),
          averageBookingValue: parseFloat(
            stats[0].average_booking_value || 0,
          ).toFixed(2),
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReservations / limit),
          totalReservations,
          hasNext: page * limit < totalReservations,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

async function getMonthlyStats(req, res) {
  try {
    const userId = req.user.id;
    const database = new Database();
    const conn = await database.connect();

    const [stats] = await conn.promise().query(
      `
                SELECT 
                    DATE_FORMAT(Date_Start_Reservation, '%Y-%m') as month,
                    COUNT(*) as total_reservations,
                    COALESCE(SUM(Price_Reservation), 0) as total_spent,
                    COALESCE(AVG(Price_Reservation), 0) as average_booking_value,
                    SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) as completed_count,
                    SUM(CASE WHEN Status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
                FROM reservations
                WHERE ID_Client = ?
                GROUP BY month
               
            `,
      [userId],
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Retrieves the reservations for the authenticated user.
 *
 * @param {Object} req - The request object, containing information about the HTTP request, including parameters and the authenticated user.
 * @param {Object} res - The response object, used to send the HTTP response back to the client.
 * @return {Promise<Object>} A promise that resolves with the user's reservations or handles errors if they occur.
 */
async function getMyReservations(req, res) {
  try {
    // Set the userId parameter to the authenticated user's ID
    req.params.userId = req.user.id;

    // Call the main function
    return await getReservationsByUser(req, res);
  } catch (error) {
    console.error("Error fetching my reservations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Handles the creation of a car reservation by validating input data, checking car availability,
 * calculating the reservation price, and inserting a new record in the reservations database.
 * Responds with the details of the created reservation or an appropriate error message.
 *
 * @param {Object} req - The request object containing user information and reservation details.
 * @param {Object} req.body - The body of the request containing the reservation information.
 * @param {string} req.body.ID_Car - The ID of the car to be reserved.
 * @param {string} req.body.startDate - The start date of the reservation in ISO format.
 * @param {string} req.body.endDate - The end date of the reservation in ISO format.
 * @param {Object} req.user - The user object representing the authenticated client.
 * @param {string} req.user.id - The ID of the client making the reservation.
 * @param {Object} res - The response object used to send HTTP responses to the client.
 * @return {Promise<void>} A promise that resolves to a response with the reservation details if successful, or an error message otherwise.
 */
async function createReservation(req, res) {
  try {
    const { ID_Car, startDate, endDate } = req.body;
    const clientId = req.user.id;
    console.log("creation of the reservation");
    console.log(req.body);
    // Validation
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const database = new Database();
    const conn = await database.connect();
    // Check if car exists and get price
    const [carResult] = await conn
      .promise()
      .query("SELECT ID_Car, Price_Car, ID_Seller FROM Car WHERE ID_Car = ?", [
        ID_Car,
      ]);

    if (carResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    const car = carResult[0];

    // Prevent self-booking
    if (car.ID_Seller === clientId) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own car",
      });
    }
    const formattedStartDate = database.formatDateForMySQL(startDate);
    const formattedEndDate = database.formatDateForMySQL(endDate);

    // Check car availability for the requested dates
    const [conflictingReservations] = await conn.promise().query(
      `
            SELECT ID_Reservation 
            FROM reservations 
            WHERE ID_Car = ? 
            AND Status IN ('available', 'reserved', 'active')
            AND (
                (Date_Start_Reservation <= ? AND Date_End_Reservation > ?) OR
                (Date_Start_Reservation < ? AND Date_End_Reservation >= ?) OR
                (Date_Start_Reservation >= ? AND Date_End_Reservation <= ?)
            )
        `,
      [
        ID_Car,
        formattedStartDate,
        formattedStartDate,
        formattedEndDate,
        formattedEndDate,
        formattedStartDate,
        formattedEndDate,
      ],
    );

    if (conflictingReservations.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Car is not available for the selected dates",
      });
    }

    // Calculate total price
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.Price_Car;

    // Create reservation
    const [result] = await conn.promise().query(
      `
            INSERT INTO reservations 
            (ID_Client, ID_Car, Price_Reservation, Date_Start_Reservation, Date_End_Reservation, Status) 
            VALUES (?, ?, ?, ?, ?, 'reserved')
        `,
      [clientId, ID_Car, totalPrice, formattedStartDate, formattedEndDate],
    );

    const reservationId = result.insertId;

    // Get the created reservation with full details
    const [newReservation] = await conn.promise().query(
      `
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
        `,
      [reservationId],
    );

    // Update car availability status
    await conn.promise().query(
      `
            UPDATE Car_Availability 
            SET Status = 'reserved' 
            WHERE ID_Car = ? 
            AND Date_Start_Available <= ? 
            AND Date_End_Available >= ?
        `,
      [ID_Car, formattedEndDate, formattedStartDate],
    );

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
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
          email: newReservation[0].Email_Client,
        },
        car: {
          name: newReservation[0].Name_Car,
          brand: newReservation[0].Marque_Car,
          model: newReservation[0].Modele_Car,
        },
      },
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Updates the details of an existing reservation based on provided input.
 *
 * This method handles authorization checks, status transitions, date validations,
 * and performs necessary updates to the reservation in the database.
 * Additional actions for specific statuses, such as creating active rental records or updating car availability, are also handled.
 *
 * @param {Object} req - The HTTP request object containing reservation details and user information.
 * @param {Object} req.body - The request body with update details.
 * @param {number} req.body.ID_Car - The ID of the car associated with the reservation.
 * @param {number} req.body.reservationId - The ID of the reservation to be updated.
 * @param {string} [req.body.status] - Optional. The updated status of the reservation.
 * @param {string} [req.body.startDate] - Optional. The new start date for the reservation (format: YYYY-MM-DD).
 * @param {string} [req.body.endDate] - Optional. The new end date for the reservation (format: YYYY-MM-DD).
 * @param {Object} req.user - The user information extracted from authentication.
 * @param {number} req.user.id - The ID of the user making the request.
 * @param {number} req.user.role - The role of the user making the request.
 * @param {Object} res - The HTTP response object used to send response to the client.
 *
 * @return {Promise<void>} A promise that handles the update operation and sends appropriate HTTP responses.
 * Returns a success response if the update is successful or error messages for validation, authorization, or other issues.
 */
async function updateReservation(req, res) {
  try {
    const { ID_Car, reservationId, status, startDate, endDate } = req.body;
    const clientId = req.user.id;
    const userRole = req.user.role;

    if (!reservationId) {
      return res.status(400).json({
        success: false,
        message: "Reservation ID is required",
      });
    }
    const database = new Database();
    const conn = await database.connect();

    // Get existing reservation
    const [existingReservation] = await conn.promise().query(
      `
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
        `,
      [reservationId, ID_Car],
    );

    if (existingReservation.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    const reservation = existingReservation[0];
    const isOwner = reservation.ID_Client === clientId;
    const isCarOwner = reservation.ID_Seller === clientId;
    const isAdmin = userRole === 4;

    // Authorization check
    if (!isOwner && !isCarOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this reservation",
      });
    }
    console.log("isadmin : " + isAdmin);
    // Status update logic
    if (status) {
      /**
       * An object representing valid status transitions for a process or entity.
       * The keys are the current statuses, and the values are arrays of statuses
       * to which it can transition.
       *
       * - 'pending': Can transition to 'confirmed' or 'cancelled'.
       * - 'confirmed': Can transition to 'active', 'cancelled', or stay 'confirmed'.
       * - 'active': Can transition only to 'completed'.
       * - 'completed': Cannot transition to any other status.
       * - 'cancelled': Cannot transition to any other status.
       */
      const validStatusTransitions = {
        available: ["reserved"],
        reserved: ["active", "available"],
        active: ["rented"],
        rented: ["available", "blocked"],
        blocked: ["available"],
      };

      const allowedStatuses = validStatusTransitions[reservation.Status] || [];
      console.log("Reservation Status : " + reservation.Status);
      console.log("Status : " + status);
      console.log(
        "allowedStatuses : " + validStatusTransitions[reservation.Status],
      );
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from ${reservation.Status} to ${status}`,
        });
      }

      // Additional authorization for status changes
      if (status === "confirmed" && (!isCarOwner || !isAdmin)) {
        return res.status(403).json({
          success: false,
          message: "Only car owner can confirm reservations",
        });
      }

      if (status === "cancelled" && reservation.Status === "active") {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel active reservation",
        });
      }
    }

    // Date validation for updates
    if (startDate || endDate) {
      const newStartDate =
        database.formatDateForMySQL(startDate) ||
        reservation.Date_Start_Reservation;
      const newEndDate =
        database.formatDateForMySQL(endDate) ||
        reservation.Date_End_Reservation;

      if (reservation.Status === "active") {
        return res.status(400).json({
          success: false,
          message: "Cannot modify dates of active reservation",
        });
      }

      // Check availability for new dates
      if (startDate || endDate) {
        const [conflicts] = await conn.promise().query(
          `
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
                `,
          [
            ID_Car,
            reservationId,
            newStartDate,
            newStartDate,
            newEndDate,
            newEndDate,
            newStartDate,
            newEndDate,
          ],
        );

        if (conflicts.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Car is not available for the selected dates",
          });
        }
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (status) {
      updateFields.push("Status = ?");
      updateValues.push(status);
    }

    if (startDate) {
      updateFields.push("Date_Start_Reservation = ?");
      updateValues.push(database.formatDateForMySQL(startDate));
    }

    if (endDate) {
      updateFields.push("Date_End_Reservation = ?");
      updateValues.push(database.formatDateForMySQL(endDate));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    updateValues.push(reservationId);

    // Update reservation
    await conn
      .promise()
      .query(
        `UPDATE reservations SET ${updateFields.join(", ")} WHERE ID_Reservation = ?`,
        updateValues,
      );

    // Handle status-specific actions
    if (status === "active") {
      // Create active rental record
      const [carPrice] = await conn
        .promise()
        .query("SELECT Price_Car FROM Car WHERE ID_Car = ?", [ID_Car]);

      await conn.promise().query(
        `
                INSERT INTO Active_Rentals 
                (ID_Reservation, ID_Car, ID_Client, Start_Date, End_Date, Actual_Pickup_Time)
                VALUES (?, ?, ?, ?, ?, NOW())
            `,
        [
          reservationId,
          ID_Car,
          reservation.ID_Client,
          newStartDate,
          newEndDate,
        ],
      );
    }

    if (status === "completed") {
      // Remove from active rentals
      await conn
        .promise()
        .query("DELETE FROM Active_Rentals WHERE ID_Reservation = ?", [
          reservationId,
        ]);
    }

    if (status === "cancelled") {
      // Update car availability back to available
      await conn.promise().query(
        `
                UPDATE Car_Availability 
                SET Status = 'available' 
                WHERE ID_Car = ? 
                AND Date_Start_Available <= ? 
                AND Date_End_Available >= ?
            `,
        [
          ID_Car,
          reservation.Date_End_Reservation,
          reservation.Date_Start_Reservation,
        ],
      );
    }

    // Get updated reservation
    const [updatedReservation] = await conn.promise().query(
      `
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
        `,
      [reservationId],
    );

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: {
        id: updatedReservation[0].ID_Reservation,
        price: updatedReservation[0].Price_Reservation,
        startDate: updatedReservation[0].Date_Start_Reservation,
        endDate: updatedReservation[0].Date_End_Reservation,
        status: updatedReservation[0].Status,
        createdAt: updatedReservation[0].Created_At,
        client: {
          firstName: updatedReservation[0].Prenom_Client,
          lastName: updatedReservation[0].Nom_Client,
        },
        car: {
          name: updatedReservation[0].Name_Car,
          brand: updatedReservation[0].Marque_Car,
          model: updatedReservation[0].Modele_Car,
        },
      },
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Deletes a reservation from the system with authorization and business rules checks.
 *
 * @param {Object} req - The request object containing user, reservation, and car details.
 * @param {Object} res - The response object used to send back the operation result.
 * @return {Promise<void>} A promise that resolves when the reservation is deleted or rejects with an error response.
 */
async function deleteReservation(req, res) {
  try {
    const { reservationId, ID_Car } = req.body;
    const clientId = req.user.id;
    const userRole = req.user.role;
    console.log("reservationId : " + reservationId);
    if (!reservationId) {
      return res.status(400).json({
        success: false,
        message: "Reservation ID is required",
      });
    }

    const database = new Database();
    const conn = await database.connect();

    // Get reservation details
    const [existingReservation] = await conn.promise().query(
      `
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
        `,
      [reservationId, ID_Car],
    );

    if (existingReservation.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    const reservation = existingReservation[0];
    const isOwner = reservation.ID_Client === clientId;
    const isCarOwner = reservation.ID_Seller === clientId;
    const isAdmin = userRole === "admin";

    // Authorization check
    if (!isOwner && !isCarOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this reservation",
      });
    }

    // Business rules for deletion
    if (reservation.Status === "active") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete active reservation. Please complete it first.",
      });
    }

    if (reservation.Status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete completed reservation for record keeping.",
      });
    }

    // Remove from active rentals if exists
    await conn
      .promise()
      .query("DELETE FROM Active_Rentals WHERE ID_Reservation = ?", [
        reservationId,
      ]);

    // Update car availability back to available
    await conn.promise().query(
      `
            UPDATE Car_Availability 
            SET Status = 'available' 
            WHERE ID_Car = ? 
            AND Date_Start_Available <= ? 
            AND Date_End_Available >= ?
        `,
      [
        ID_Car,
        reservation.Date_End_Reservation,
        reservation.Date_Start_Reservation,
      ],
    );

    // Delete reservation
    await conn
      .promise()
      .query("DELETE FROM reservations WHERE ID_Reservation = ?", [
        reservationId,
      ]);

    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

module.exports = {
  getReservation,
  getReservationsByUser,
  getMyReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  getMonthlyStats,
};
