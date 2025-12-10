const database = require("../../database/database");
const path = require("path");

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get all cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of cars per page
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by car brand
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per day
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per day
 *     responses:
 *       200:
 *         description: List of cars retrieved successfully
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
 *                     $ref: '#/components/schemas/Car'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car created successfully
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
 *                   example: "Car created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Invalid input data
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
 *   put:
 *     summary: Update an existing car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Car'
 *               - type: object
 *                 required: ['carId']
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input data
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
 *         description: Forbidden - Can only update own cars
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
 *   delete:
 *     summary: Delete a car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['carId']
 *             properties:
 *               carId:
 *                 type: integer
 *                 description: ID of car to delete
 *     responses:
 *       200:
 *         description: Car deleted successfully
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
 *         description: Forbidden - Can only delete own cars
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
 * /cars/available:
 *   get:
 *     summary: Get available cars for rent
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability check
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability check
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *     responses:
 *       200:
 *         description: Available cars retrieved successfully
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
 *                     $ref: '#/components/schemas/Car'
 *
 * /car/{id}:
 *   get:
 *     summary: Get car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

function getCars(req, res) {
  const { index, limit } = req.params;
  let params = [];
  let query = `SELECT 
                    c.*,
                    CONCAT(seller.Name_Client, ' ', seller.Surname_Client) as Seller_Name,
                    seller.Email_Client as Seller_Email,
                    seller.PhoneNumber_Client as Seller_Phone
                 FROM Car c
                 LEFT JOIN Client seller ON c.ID_Seller = seller.ID_Client`;

  // Fix the condition logic - if index is provided and > 0, filter by ID
  if (index && index > 0) {
    query += " WHERE c.ID_Car = ?";
    params.push(index);
  }

  query += " ORDER BY c.Created_At DESC";

  if (limit && limit > 0) {
    query += " LIMIT ?";
    params.push(limit);
  }

  const db = new database.Database();
  const conn = db.connect();

  conn.query(query, params, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error occurred" });
      db.disconnect(conn);
      return;
    }

    if (results) {
      res.status(200).json({
        success: true,
        data: results,
        count: results.length,
      });
    }
    db.disconnect(conn);
  });
}

function getCarById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Car ID is required" });
  }

  let query = `SELECT 
                    c.*,
                    CONCAT(seller.Name_Client, ' ', seller.Surname_Client) as Seller_Name,
                    seller.Email_Client as Seller_Email,
                    seller.PhoneNumber_Client as Seller_Phone,
                    ROUND(AVG(r.Note_Review), 2) as Average_Rating,
                    COUNT(r.ID_Review) as Total_Reviews
                 FROM Car c
                 LEFT JOIN Client seller ON c.ID_Seller = seller.ID_Client
                 LEFT JOIN Review r ON c.ID_Car = r.ID_Car
                 WHERE c.ID_Car = ?
                 GROUP BY c.ID_Car`;

  const db = new database.Database();
  const conn = db.connect();

  conn.query(query, [id], function (err, results) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error occurred" });
      db.disconnect(conn);
      return;
    }

    if (results && results.length > 0) {
      res.status(200).json({
        success: true,
        data: results[0],
      });
    } else {
      res.status(404).json({ error: "Car not found" });
    }
    db.disconnect(conn);
  });
}

function getMyCars(req, res) {
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let query = `SELECT 
  
                        c.*,
                        CONCAT(seller.Name_Client, ' ', seller.Surname_Client) as Seller_Name,
                        seller.Email_Client as Seller_Email,
                        seller.PhoneNumber_Client as Seller_Phone,
                        ROUND(AVG(r.Note_Review), 2) as Average_Rating,
                        COUNT(r.ID_Review) as Total_Reviews
                     FROM Car c
                     LEFT JOIN Client seller ON c.ID_Seller = seller.ID_Client
                     LEFT JOIN Review r ON c.ID_Car = r.ID_Car
                     WHERE c.ID_Seller = ?
                     GROUP BY c.ID_Car`;

  const db = new database.Database();
  const conn = db.connect();

  conn.query(query, [userId], function (err, results) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error occurred" });
      db.disconnect(conn);
      return;
    }

    res.status(200).json({
      success: true,
      data: results || [],
      count: results ? results.length : 0,
    });
    db.disconnect(conn);
  });
}

function createCar(req, res) {
  const { id } = req.user;
  const {
    brand,
    model,
    year,
    mileage,
    description,
    price,
    location,
    licensePlate,
    passenger,
    status,
  } = req.body;

  console.log(req.body);
  // Validation
  if (
    !id ||
    !brand ||
    !model ||
    !year ||
    !mileage ||
    !price ||
    !licensePlate ||
    !passenger
  ) {
    return res.status(400).json({
      error:
        "Missing required fields: id_seller, brand_car, model_car, year_car, mileage, price, license Plate, passenger",
    });
  }

  let params = [
    id,
    brand,
    model,
    year,
    mileage,
    description,
    price,
    location,
    licensePlate,
    passenger,
    status,
  ];
  let query = `INSERT INTO Car (
                    ID_Seller, 
                    Brand_Car,
                    Model_Car,
                    Year_Car, 
                    Mileage_Car, 
                    Description_Car, 
                    Price_Car,
                   Location_Car,
                   LicensePlate_Car,
                   Passenger_Car,
                   Status_Car
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const db = new database.Database();
  const conn = db.connect();

  conn.query(query, params, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to create car" });
      db.disconnect(conn);
      return;
    }

    if (results) {
      console.log("Car created with ID:", results.insertId);
      res.status(201).json({
        success: true,
        message: "Car created successfully",
        data: {
          id: results.insertId,
          affectedRows: results.affectedRows,
        },
      });
    }
    db.disconnect(conn);
  });
}

function updateCar(req, res) {
  const {
    carId,
    brand,
    model,
    year,
    mileage,
    description,
    price,
    location,
    licensePlate,
    passenger,
    status,
  } = req.body;

  if (!carId) {
    return res.status(400).json({ error: "Car ID is required" });
  }

  // Build dynamic update query
  let updateFields = [];
  let params = [];

  if (brand !== undefined) {
    updateFields.push("Brand_Car = ?");
    params.push(brand);
  }
  if (model !== undefined) {
    updateFields.push("Model_Car = ?");
    params.push(model);
  }
  if (year !== undefined) {
    updateFields.push("Year_Car = ?");
    params.push(year);
  }
  if (mileage !== undefined) {
    updateFields.push("Mileage_Car = ?");
    params.push(mileage);
  }
  if (description !== undefined) {
    updateFields.push("Description_Car = ?");
    params.push(description);
  }
  if (price !== undefined) {
    updateFields.push("Price_Car = ?");
    params.push(price);
  }
  if (location !== undefined) {
    updateFields.push("Location_Car = ?");
    params.push(location);
  }
  if (licensePlate !== undefined) {
    updateFields.push("LicensePlate_Car = ?");
    params.push(licensePlate);
  }
  if (passenger !== undefined) {
    updateFields.push("Passenger_Car = ?");
    params.push(passenger);
  }
  if (status !== undefined) {
    updateFields.push("Status_Car = ?");
    params.push(status);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  params.push(carId);

  let query = `UPDATE Car SET ${updateFields.join(", ")} WHERE ID_Car = ?`;

  const db = new database.Database();
  const conn = db.connect();

  conn.promise().query(query, params, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to update car" });
      db.disconnect(conn);
      return;
    }

    if (results) {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Car not found" });
      } else {
        res.status(200).json({
          success: true,
          message: "Car updated successfully",
          data: {
            affectedRows: results.affectedRows,
          },
        });
      }
    }
    db.disconnect(conn);
  });
}

function deleteCar(req, res) {
  const { carId } = req.params;
  if (!carId) {
    return res.status(400).json({ error: "Car ID is required" });
  }

  let query = `DELETE FROM Car WHERE ID_Car = ?`;
  const db = new database.Database();
  const conn = db.connect();

  conn.promise().query(query, [carId], function (err, results) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to delete car" });
      db.disconnect(conn);
      return;
    }

    if (results) {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Car not found" });
      } else {
        res.status(200).json({
          success: true,
          message: "Car deleted successfully",
          data: {
            affectedRows: results.affectedRows,
          },
        });
      }
    }
    db.disconnect(conn);
  });
}

function getAvailableCars(req, res) {
  const { startDate, endDate, location, passenger, limit = 10 } = req.query;
  console.log(req.query);
  let query = `SELECT DISTINCT
                    c.*,
                    CONCAT(seller.Name_Client, ' ', seller.Surname_Client) as Seller_Name,
                    CAST(ROUND(AVG(r.Note_Review), 2) AS FLOAT )as Average_Rating,
                    COUNT(r.ID_Review) as Total_Reviews
                 FROM Car c
                 LEFT JOIN Client seller ON c.ID_Seller = seller.ID_Client
                 LEFT JOIN Review r ON c.ID_Car = r.ID_Car`;

  let params = [];
  let whereConditions = [];

  if (startDate && endDate) {
    whereConditions.push(`NOT EXISTS (
          SELECT 1 FROM reservations res 
          WHERE res.ID_Car = c.ID_Car 
          AND res.Status NOT IN ('cancelled', 'completed') 
          AND res.Date_Start_Reservation <= STR_TO_DATE(?, '%Y-%m-%d')  
          AND res.Date_End_Reservation >= STR_TO_DATE(?, '%Y-%m-%d')
        )`);
    params.push(endDate, startDate);
  }

  if (location) {
    whereConditions.push("c.Location_Car LIKE ?");
    params.push(`${location}`);
  }

  if (passenger) {
    whereConditions.push("c.Passenger_Car >= ?");
    params.push(parseInt(passenger));
  }

  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  query += " GROUP BY c.ID_Car ORDER BY c.Created_At DESC";

  if (limit) {
    query += " LIMIT ?";
    params.push(parseInt(limit));
  }

  const db = new database.Database();
  const conn = db.connect();

  console.log(query, params);
  conn.query(query, params, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error occurred" });
      db.disconnect(conn);
      return;
    }
    console.log("Available cars retrieved:", results.length);
    res.status(200).json({
      success: true,
      data: results || [],
      count: results ? results.length : 0,
    });
    db.disconnect(conn);
  });
}

/**
 * Get single car image metadata
 */
async function getCarImage(req, res) {
  try {
    const { carId, imageId } = req.params;
    const conn = new database.Database().connect();

    // Validate car exists
    const [car] = await conn
      .promise()
      .query("SELECT ID_Car FROM Car WHERE ID_Car = ?", [carId]);

    if (car.length === 0) {
      conn.end();
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Get specific image
    const [images] = await conn.promise().query(
      `
            SELECT 
                ID_Image,
                Image_Path,
                Image_Name,
                Original_Name,
                Image_Type,
                Image_Description,
                Image_Size,
                Image_Width,
                Image_Height,
                Image_Format,
                Display_Order,
                Is_Primary,
                Alt_Text,
                Created_At
            FROM Car_Images 
            WHERE ID_Image = ? AND ID_Car = ? AND Is_Active = 1
        `,
      [imageId, carId],
    );

    conn.end();

    if (images.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const image = images[0];
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      data: {
        id: image.ID_Image,
        url: `${baseUrl}${image.Image_Path}`,
        downloadUrl: `${baseUrl}/car/${carId}/image/${imageId}/file`,
        base64Url: `${baseUrl}/car/${carId}/image/${imageId}/base64`,
        filename: image.Image_Name,
        originalName: image.Original_Name,
        type: image.Image_Type,
        description: image.Image_Description,
        size: image.Image_Size,
        dimensions: {
          width: image.Image_Width,
          height: image.Image_Height,
        },
        format: image.Image_Format,
        displayOrder: image.Display_Order,
        isPrimary: image.Is_Primary === 1,
        altText: image.Alt_Text,
        createdAt: image.Created_At,
      },
    });
  } catch (error) {
    console.error("Error fetching car image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

async function getCarImages(req, res) {
  const { carId } = req.params;

  if (!carId) {
    return res.status(400).json({ error: "Car ID is required" });
  }

  let query = `SELECT ID_Image,
                        Image_Path,
                        Image_Name,
                        Image_Type,
                        Image_Description,
                        Display_Order,
                        Is_Primary
                 FROM Car_Images
                 WHERE ID_Car = ?
                   AND Is_Active = 1
                 ORDER BY Display_Order ASC, Is_Primary DESC`;

  try {
    const db = new database.Database();
    const conn = await db.connect();

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    let [results] = await conn.promise().query(query, [carId]);
    results = results.map(
      (image) => (image.Image_Path = `${baseUrl}${image.Image_Path}`),
    );
    res.status(200).json({
      success: true,
      data: results || [],
      count: results ? results.length : 0,
    });

    await db.disconnect(conn);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch car images" });
  }
}

module.exports = {
  getCars,
  getCarById,
  getMyCars,
  createCar,
  updateCar,
  deleteCar,
  getAvailableCars,
  getCarImage,
  getCarImages,
};
