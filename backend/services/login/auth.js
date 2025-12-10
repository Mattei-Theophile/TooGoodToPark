const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Database } = require("../../database/database");

const jwt_key = process.env.JWT_KEY;

function generateToken(user, expiresIn = "1h") {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    jwt_key,
    { expiresIn: expiresIn },
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      type: "refresh",
    },
    jwt_key,
    { expiresIn: "7d" },
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, jwt_key);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const authenticateTokenWithRefresh = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    req.user = verifyToken(token);

    next();
  } catch (error) {
    // If access token is invalid/expired, try to refresh it
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Access token expired and no refresh token available",
        requiresLogin: true,
      });
    }

    try {
      const decoded = verifyToken(refreshToken);
      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      // Return a specific response indicating token refresh is needed
      res.cookie("refreshToken", refreshToken);
      return res.status(401).json({
        error: "Access token expired",
        needsRefresh: true,
      });
    } catch (refreshError) {
      res.clearCookie("refreshToken");
      return res.status(401).json({
        error: "Both access and refresh tokens are invalid",
        requiresLogin: true,
      });
    }
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await validateUserCredentials(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      accessToken,
      userId: user.id,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to validate user credentials (implement with your database)
async function validateUserCredentials(email, password) {
  const db = new Database();
  const connection = db.connect();

  try {
    const [rows] = await connection
      .promise()
      .query(
        "SELECT ID_Client as id, Email_Client as email, Password_Client as password FROM Client WHERE Email_Client = ?",
        [email],
      );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } finally {
    db.disconnect(connection);
  }
}

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid refresh token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const decoded = verifyToken(refreshToken);
    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    // Get user from database
    const user = await getUserById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate new access token
    const newAccessToken = generateToken(user);
    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.clearCookie("refreshToken");
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user and invalidate tokens
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Logout endpoint
exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully" });
};

// Helper function to get user by ID (for refresh token)
async function getUserById(userId) {
  const db = new Database();
  const connection = db.connect();

  try {
    const [rows] = await connection
      .promise()
      .query(
        "SELECT ID_Client as id, Email_Client as email FROM Client WHERE ID_Client = ?",
        [userId],
      );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } finally {
    db.disconnect(connection);
  }
}

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authenticateTokenWithRefresh,
  login: exports.login,
  refreshToken: exports.refreshToken,
  logout: exports.logout,
};
