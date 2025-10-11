const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Database} = require('../../database/database');
const jwt_key = process.env.JWT_KEY;

function generateToken(user, expiresIn = '1h') {
    return jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        },
        jwt_key,
        { expiresIn: expiresIn });
}

function generateRefreshToken(user) {
    return jwt.sign({
            id: user.id,
            type: 'refresh'
        },
        jwt_key,
        { expiresIn: '7d' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, jwt_key);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

async function hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        req.user = verifyToken(token);

        next();
    } catch (error) {

        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {

        const user = await validateUserCredentials(email, password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to validate user credentials (implement with your database)
async function validateUserCredentials(email, password) {
    const db = new Database();
    const connection = db.connect();

    try {
        const [rows] = await connection.promise().query(
            'SELECT ID_Client as id, Email_Client as email, Password_Client as password FROM Client WHERE Email_Client = ?',
            [email]
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
            role: user.role
        };
    } finally {
        db.disconnect(connection);
    }
}

// Refresh token endpoint
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = verifyToken(refreshToken);

        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        // Get user from database
        const user = await getUserById(decoded.id);
        
        if (!user) {
            throw new Error('User not found');
        }

        // Generate new access token
        const newAccessToken = generateToken(user);

        res.json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        res.clearCookie('refreshToken');
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};

// Logout endpoint
exports.logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
};

// Helper function to get user by ID (for refresh token)
async function getUserById(userId) {
    const db = new Database();
    const connection = db.connect();

    try {
        const [rows] = await connection.promise().query(
            'SELECT ID_Client as id, Email_Client as email, Type_Abonnement as role FROM Client WHERE ID_Client = ?',
            [userId]
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
    authenticateToken,
    login: exports.login,
    refreshToken: exports.refreshToken,
    logout: exports.logout
};