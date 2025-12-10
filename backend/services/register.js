const bcrypt = require("bcrypt");
const { Database } = require("../database/database");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number validation (basic international format)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Check if email already exists
async function checkEmailExists(email) {
  const db = new Database();
  const connection = db.connect();

  try {
    const [rows] = await connection
      .promise()
      .query("SELECT ID_Client FROM Client WHERE Email_Client = ?", [email]);
    return rows.length > 0;
  } finally {
    db.disconnect(connection);
  }
}

// Validate registration data
function validateRegistrationData(data) {
  const errors = [];
  const { email, password, lastname, firstname, phonenumber } = data;
  console.log(data);
  // Required fields validation
  if (!email || !email.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!lastname || !lastname.trim()) {
    errors.push("Last name is required");
  } else if (lastname.length > 50) {
    errors.push("Last name must be less than 50 characters");
  }

  if (!firstname || !firstname.trim()) {
    errors.push("First name is required");
  } else if (firstname.length > 50) {
    errors.push("First name must be less than 50 characters");
  }

  if (!phonenumber || !phonenumber.trim()) {
    errors.push("Phone number is required");
  } else if (!phoneRegex.test(phonenumber.replace(/\s/g, ""))) {
    errors.push("Please provide a valid phone number");
  } else if (phonenumber.length > 50) {
    errors.push("Phone number must be less than 50 characters");
  }

  return errors;
}

// Create a new user
async function createUser(userData) {
  const { email, password, surname, name, phonenumber } = userData;

  const db = new Database();
  const connection = db.connect();

  try {
    const hashedPassword = await hashPassword(password);

    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO Client (Email_Client, Password_Client, Surname_Client, Name_Client, PhoneNumber_Client) VALUES (?, ?, ?, ?, ?)",
        [email, hashedPassword, surname, name, phonenumber],
      );

    return {
      id: result.insertId,
      email: email,
      surname: surname,
      name: name,
    };
  } finally {
    db.disconnect(connection);
  }
}

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstname
 *               - lastname
 *               - phonenumber
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User's password (minimum 6 characters)
 *                 example: "securepassword123"
 *               firstname:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *               phonenumber:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         password:
 *                           type: string
 *                           description: "Excluded from response"
 *                           writeOnly: true
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_fields:
 *                 value:
 *                   error: "Validation Error"
 *                   message: "Missing required fields: email, password"
 *                   status: 400
 *               invalid_email:
 *                 value:
 *                   error: "Validation Error"
 *                   message: "Invalid email format"
 *                   status: 400
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Conflict"
 *               message: "User with this email already exists"
 *               status: 409
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.register = async (req, res) => {
  const { email, password, lastname, firstname, phonenumber } = req.body;

  try {
    // Validate input data
    const validationErrors = validateRegistrationData({
      email,
      password,
      lastname,
      firstname,
      phonenumber,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors,
      });
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(email.toLowerCase());
    if (emailExists) {
      return res.status(409).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Create new user
    const newUser = await createUser({
      email: email.toLowerCase(),
      password,
      surname: lastname.trim(),
      name: firstname.trim(),
      phonenumber: phonenumber.trim(),
    });

    res.send(200).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific MySQL errors
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error during registration",
    });
  }
};

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id; // From authenticated token

  const db = new Database();
  const connection = db.connect();

  try {
    const [rows] = await connection
      .promise()
      .query(
        "SELECT ID_Client as id, Email_Client as email, Surname_Client as surname, Name_Client as name, Client.PhoneNumber_Client as phoneNumber, Address_Client as address, ZipCode_Client as zipCode, City_Client as city, Country_Client as country FROM Client WHERE ID_Client = ?",
        [userId],
      );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  } finally {
    db.disconnect(connection);
  }
};

module.exports = {
  register: exports.register,
  getUserProfile: exports.getUserProfile,
};

/**
 * @swagger
 * /account/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create user profile (alternative registration)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               phonenumber:
 *                 type: string
 *                 example: "+1234567890"
 *               bio:
 *                 type: string
 *                 description: User biography
 *               location:
 *                 type: string
 *                 description: User location
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid profile data
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
 *     summary: Update current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "Jane"
 *               lastname:
 *                 type: string
 *                 example: "Smith"
 *               phonenumber:
 *                 type: string
 *                 example: "+1987654321"
 *               bio:
 *                 type: string
 *                 description: Updated user biography
 *               location:
 *                 type: string
 *                 description: Updated user location
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *   delete:
 *     summary: Delete user account
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
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
 *                   example: "Account deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Cannot delete account with active reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
