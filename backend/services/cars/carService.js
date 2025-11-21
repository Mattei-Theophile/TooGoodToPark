const database = require("../../database/database");
const path = require("path");
const fs = require("fs-extra");

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
 *                 required: ['ID_Car']
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
 *             required: ['ID_Car']
 *             properties:
 *               ID_Car:
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
                    c.ID_Car,
                    c.ID_Seller,
                    c.Name_Car,
                    c.Marque_Car,
                    c.Modele_Car,
                    c.Annee_Car,
                    c.Kilometrage_Car,
                    c.Description_Car,
                    c.Price_Car,
                    c.Date_Car,
                    c.Created_At,
                    c.Updated_At,
                    CONCAT(seller.Prenom_Client, ' ', seller.Nom_Client) as Seller_Name,
                    seller.Email_Client as Seller_Email,
                    seller.Numero_Telephone as Seller_Phone
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
      console.log("Cars retrieved:", results.length);
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
                    CONCAT(seller.Prenom_Client, ' ', seller.Nom_Client) as Seller_Name,
                    seller.Email_Client as Seller_Email,
                    seller.Numero_Telephone as Seller_Phone,
                    ROUND(AVG(r.Note_Review), 2) as Average_Rating,
                    COUNT(r.ID_Review) as Total_Reviews
                 FROM Car c
                 LEFT JOIN Client seller ON c.ID_Seller = seller.ID_Client
                 LEFT JOIN Review r ON c.ID_Car = r.ID_car
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
                        CONCAT(seller.Prenom_Client, ' ', seller.Nom_Client) as Seller_Name,
                        seller.Email_Client as Seller_Email,
                        seller.Numero_Telephone as Seller_Phone,
                        ROUND(AVG(r.Note_Review), 2) as Average_Rating,
                        COUNT(r.ID_Review) as Total_Reviews
                     FROM Car c
                     LEFT JOIN Client seller ON c.ID_Seller = seller.ID_Client
                     LEFT JOIN Review r ON c.ID_Car = r.ID_car
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
  const {
    id_seller,
    name_car,
    marque_car,
    modele_car,
    annee_car,
    kilometrage_car,
    description_car,
    price_car,
    id_client,
  } = req.body;

  // Validation
  if (
    !id_seller ||
    !name_car ||
    !marque_car ||
    !modele_car ||
    !annee_car ||
    !kilometrage_car ||
    !price_car
  ) {
    return res.status(400).json({
      error:
        "Missing required fields: id_seller, name_car, marque_car, modele_car, annee_car, kilometrage_car, price_car",
    });
  }

  let params = [
    id_seller,
    name_car,
    marque_car,
    modele_car,
    annee_car,
    kilometrage_car,
    description_car,
    price_car,
    id_client,
  ];
  let query = `INSERT INTO Car (
                    ID_Seller, 
                    Name_Car, 
                    Marque_Car, 
                    Modele_Car, 
                    Annee_Car, 
                    Kilometrage_Car, 
                    Description_Car, 
                    Price_Car, 
                    ID_Client
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
    ID_Car,
    name_car,
    marque_car,
    modele_car,
    annee_car,
    kilometrage_car,
    description_car,
    price_car,
    id_client,
  } = req.body;

  if (!ID_Car) {
    return res.status(400).json({ error: "Car ID is required" });
  }

  // Build dynamic update query
  let updateFields = [];
  let params = [];

  if (name_car !== undefined) {
    updateFields.push("Name_Car = ?");
    params.push(name_car);
  }
  if (marque_car !== undefined) {
    updateFields.push("Marque_Car = ?");
    params.push(marque_car);
  }
  if (modele_car !== undefined) {
    updateFields.push("Modele_Car = ?");
    params.push(modele_car);
  }
  if (annee_car !== undefined) {
    updateFields.push("Annee_Car = ?");
    params.push(annee_car);
  }
  if (kilometrage_car !== undefined) {
    updateFields.push("Kilometrage_Car = ?");
    params.push(kilometrage_car);
  }
  if (description_car !== undefined) {
    updateFields.push("Description_Car = ?");
    params.push(description_car);
  }
  if (price_car !== undefined) {
    updateFields.push("Price_Car = ?");
    params.push(price_car);
  }
  if (id_client !== undefined) {
    updateFields.push("ID_Client = ?");
    params.push(id_client);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  params.push(ID_Car); // Add ID for WHERE clause

  let query = `UPDATE Car SET ${updateFields.join(", ")} WHERE ID_Car = ?`;

  const db = new database.Database();
  const conn = db.connect();

  conn.query(query, params, function (err, results) {
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
  const { ID_Car } = req.body;

  if (!ID_Car) {
    return res.status(400).json({ error: "Car ID is required" });
  }

  let query = `DELETE FROM Car WHERE ID_Car = ?`;
  const db = new database.Database();
  const conn = db.connect();

  conn.query(query, [ID_Car], function (err, results) {
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
  const { startDate, endDate, limit = 10 } = req.params;

  let query = `SELECT DISTINCT
                    c.*,
                    CONCAT(seller.Prenom_Client, ' ', seller.Nom_Client) as Seller_Name,
                    CAST(ROUND(AVG(r.Note_Review), 2) AS FLOAT )as Average_Rating,
                    COUNT(r.ID_Review) as Total_Reviews
                 FROM Car c
                 LEFT JOIN Client seller ON c.ID_Seller = seller.ID_Client
                 LEFT JOIN Review r ON c.ID_Car = r.ID_car
                 JOIN Car_Availability ca ON c.ID_Car = ca.ID_Car`;

  let params = [];
  let whereConditions = ['ca.Status = "available"'];

  if (startDate && endDate) {
    whereConditions.push("ca.Date_Start_Available <= ?");
    whereConditions.push("ca.Date_End_Available >= ?");
    params.push(startDate, endDate);
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

  conn.query(query, params, function (err, results) {
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

function searchCars(req, res) {
  const {
    marque,
    modele,
    priceMin,
    priceMax,
    yearMin,
    yearMax,
    limit = 10,
    location,
  } = req.params;
  console.log("Data from req.query: ", req.query);
  console.log(
    "query : ",
    marque,
    modele,
    priceMin,
    priceMax,
    yearMin,
    yearMax,
    limit,
    location,
  );

  let query = `SELECT 
                    c.*,
                    CONCAT(seller.Prenom_Client, ' ', seller.Nom_Client) as Seller_Name,
                    ROUND(AVG(r.Note_Review), 2) as Average_Rating,
                    COUNT(r.ID_Review) as Total_Reviews
                  FROM Car c
                  LEFT JOIN Client seller ON c.ID_Seller = seller.ID_Client
                  LEFT JOIN Review r ON c.ID_Car = r.ID_car
                  LEFT JOIN reservations re ON c.ID_Car = re.ID_Car `;

  let whereConditions = [];
  let params = [];

  if (marque) {
    whereConditions.push("c.Marque_Car LIKE ?");
    params.push(`%${marque}%`);
  }

  if (modele) {
    whereConditions.push("c.Modele_Car LIKE ?");
    params.push(`%${modele}%`);
  }

  if (priceMin) {
    whereConditions.push("c.Price_Car >= ?");
    params.push(parseInt(priceMin));
  }

  if (priceMax) {
    whereConditions.push("c.Price_Car <= ?");
    params.push(parseInt(priceMax));
  }

  if (yearMin) {
    whereConditions.push("c.Annee_Car >= ?");
    params.push(parseInt(yearMin));
  }

  if (yearMax) {
    whereConditions.push("c.Annee_Car <= ?");
    params.push(parseInt(yearMax));
  }
  if (location) {
    whereConditions.push("c.Location_Car LIKE ?");
    params.push(`%${location}%`);
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

  conn.query(query, params, function (err, results) {
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
  console.log("carId : ", carId);
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
    const conn = await db.connect(); // Make sure your Database class returns a promise

    const [results] = await conn.promise().query(query, [carId]);
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

/**
 * Serve image file directly
 */
async function serveCarImage(req, res) {
  try {
    const { carId, imageId } = req.params;
    const { size = "original" } = req.query;
    const conn = new database.Database().connect();

    // Get image details
    const [images] = await conn.query(
      `
            SELECT Image_Path, Image_Name, Image_Format 
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
    let imagePath = path.join(__dirname, "../../../", image.Image_Path);

    // Handle different sizes
    if (
      size !== "original" &&
      ["thumbnail", "medium", "large"].includes(size)
    ) {
      const directory = path.dirname(imagePath);
      const baseName = path.parse(image.Image_Name).name;
      const extension = path.parse(image.Image_Name).ext;
      const sizedFilename = `${baseName}_${size}${extension}`;
      imagePath = path.join(directory, sizedFilename);
    }

    // Check if file exists
    if (!(await fs.pathExists(imagePath))) {
      return res.status(404).json({
        success: false,
        message: "Image file not found",
      });
    }

    // Set appropriate headers
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
    };

    const mimeType =
      mimeTypes[image.Image_Format.toLowerCase()] || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${image.Image_Name}"`,
    );

    // Stream the file
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error serving image",
        });
      }
    });
  } catch (error) {
    console.error("Error serving car image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Upload image as base64
 */
async function uploadImageBase64(req, res) {
  try {
    const { carId } = req.params;
    const { images } = req.body; // Array of base64 images
    const clientId = req.user.id;
    const conn = new database.Database().connect();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images array is required",
      });
    }

    // Validate car exists and user owns it
    const [car] = await conn.query(
      "SELECT ID_Car, ID_Seller FROM Car WHERE ID_Car = ?",
      [carId],
    );

    if (car.length === 0) {
      conn.end();
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car[0].ID_Seller !== clientId && req.user.role !== "admin") {
      conn.end();
      return res.status(403).json({
        success: false,
        message: "You can only upload images for your own cars",
      });
    }

    const uploadedImages = [];
    const uploadDir = path.join(
      __dirname,
      "../../../uploads/cars",
      carId.toString(),
    );
    await fs.ensureDir(uploadDir);

    for (const imageData of images) {
      try {
        const {
          base64,
          filename,
          type = "other",
          description = "",
          displayOrder = 0,
        } = imageData;

        if (!base64) {
          continue; // Skip invalid entries
        }

        // Extract format from data URL if provided
        let format = "jpg";
        let base64Data = base64;

        if (base64.startsWith("data:")) {
          const matches = base64.match(/data:image\/([^;]+);base64,(.+)/);
          if (matches) {
            format = matches[1];
            base64Data = matches[2];
          }
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const generatedFilename =
          filename || `${timestamp}_${randomString}.${format}`;
        const filePath = path.join(uploadDir, generatedFilename);

        // Convert base64 to buffer and save
        const imageBuffer = Buffer.from(base64Data, "base64");
        await fs.writeFile(filePath, imageBuffer);

        // Get image dimensions using sharp
        const sharp = require("sharp");
        const metadata = await sharp(filePath).metadata();

        // Create different sizes
        const sizes = await createImageSizes(filePath, generatedFilename);

        // Save to database
        const [result] = await conn.query(
          `
                    INSERT INTO Car_Images (
                        ID_Car, 
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
                        Uploaded_By
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
          [
            carId,
            `/uploads/cars/${carId}/${generatedFilename}`,
            generatedFilename,
            filename || generatedFilename,
            type,
            description,
            imageBuffer.length,
            metadata.width,
            metadata.height,
            format,
            displayOrder,
            uploadedImages.length === 0 ? 1 : 0, // First image is primary
            clientId,
          ],
        );

        uploadedImages.push({
          id: result.insertId,
          filename: generatedFilename,
          originalName: filename || generatedFilename,
          path: `/uploads/cars/${carId}/${generatedFilename}`,
          type: type,
          size: imageBuffer.length,
          dimensions: {
            width: metadata.width,
            height: metadata.height,
          },
          sizes: sizes,
        });
      } catch (error) {
        console.error("Error processing base64 image:", error);
        // Continue with next image
      }
    }

    conn.end();

    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: uploadedImages,
    });
  } catch (error) {
    console.error("Error uploading base64 images:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Create different image sizes helper function
 */
async function createImageSizes(originalPath, filename) {
  const sharp = require("sharp");
  const sizes = {};
  const baseName = path.parse(filename).name;
  const extension = path.parse(filename).ext;
  const directory = path.dirname(originalPath);

  const sizeConfigs = {
    thumbnail: { width: 150, height: 150, quality: 80 },
    medium: { width: 500, height: 400, quality: 85 },
    large: { width: 1200, height: 800, quality: 90 },
  };

  for (const [sizeName, config] of Object.entries(sizeConfigs)) {
    try {
      const newFilename = `${baseName}_${sizeName}${extension}`;
      const newPath = path.join(directory, newFilename);

      await sharp(originalPath)
        .resize(config.width, config.height, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: config.quality })
        .toFile(newPath);

      sizes[sizeName] = {
        filename: newFilename,
        width: config.width,
        height: config.height,
      };
    } catch (error) {
      console.error(`Error creating ${sizeName} size:`, error);
    }
  }

  return sizes;
}

module.exports = {
  getCars,
  getCarById,
  getCarImages,
  getCarImage,
  getMyCars,
  createCar,
  updateCar,
  deleteCar,
  getAvailableCars,
  searchCars,
};
