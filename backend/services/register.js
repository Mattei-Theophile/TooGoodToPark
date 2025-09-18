const bcrypt = require('bcrypt');
const {Database} = require('../database/database');

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
        const [rows] = await connection.promise().query(
            'SELECT ID_Client FROM Client WHERE Email_Client = ?',
            [email]
        );
        return rows.length > 0;
    } finally {
        db.disconnect(connection);
    }
}

// Validate registration data
function validateRegistrationData(data) {
    const errors = [];
    const { email, password, nom, prenom, numeroTelephone, typeAbonnement } = data;

    // Required fields validation
    if (!email || !email.trim()) {
        errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!nom || !nom.trim()) {
        errors.push('Last name is required');
    } else if (nom.length > 50) {
        errors.push('Last name must be less than 50 characters');
    }

    if (!prenom || !prenom.trim()) {
        errors.push('First name is required');
    } else if (prenom.length > 50) {
        errors.push('First name must be less than 50 characters');
    }

    if (!numeroTelephone || !numeroTelephone.trim()) {
        errors.push('Phone number is required');
    } else if (!phoneRegex.test(numeroTelephone.replace(/\s/g, ''))) {
        errors.push('Please provide a valid phone number');
    } else if (numeroTelephone.length > 50) {
        errors.push('Phone number must be less than 50 characters');
    }

    // Type abonnement validation (should be 1-127 for tinyint)
    if (typeAbonnement !== undefined && (typeAbonnement < 1 || typeAbonnement > 127)) {
        errors.push('Subscription type must be between 1 and 127');
    }

    return errors;
}

// Create a new user
async function createUser(userData) {
    const { email, password, nom, prenom, numeroTelephone, typeAbonnement = 1, prixAbonnement = 0, dateDebut = new Date(), dateFin = null } = userData;

    const db = new Database();
    const connection = db.connect();

    try {
        const hashedPassword = await hashPassword(password);
        const formattedDateDebut = dateDebut ? new Date(dateDebut).toISOString().slice(0, 19).replace('T', ' ') : null;
        const formattedDateFin = dateFin ? new Date(dateFin).toISOString().slice(0, 19).replace('T', ' ') : null;

        const [result] = await connection.promise().query(
            'INSERT INTO Client (Email_Client, Password_Client, Nom_Client, Prenom_Client, Numero_Telephone) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, nom, prenom, numeroTelephone]
        );

        return {
            id: result.insertId,
            email: email,
            nom: nom,
            prenom: prenom,
            numeroTelephone: numeroTelephone,
            role: typeAbonnement
        };
    } finally {
        db.disconnect(connection);
    }
}

// Register endpoint
exports.register = async (req, res, next) => {
    const { email, password, nom, prenom, numeroTelephone, typeAbonnement, prixAbonnement, dateDebut, dateFin } = req.body;

    try {
        // Validate input data
        const validationErrors = validateRegistrationData({
            email, password, nom, prenom, numeroTelephone, typeAbonnement
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors
            });
        }

        // Check if email already exists
        const emailExists = await checkEmailExists(email.toLowerCase());
        if (emailExists) {
            return res.status(409).json({
                success: false,
                error: 'Email already registered'
            });
        }

        // Create new user
        const newUser = await createUser({
            email: email.toLowerCase(),
            password,
            nom: nom.trim(),
            prenom: prenom.trim(),
            numeroTelephone: numeroTelephone.trim(),
            typeAbonnement: typeAbonnement || 1,
            prixAbonnement,
            dateDebut,
            dateFin
        });

        res.send(200).json({
            success: true,
            user: newUser
        })

    } catch (error) {
        console.error('Registration error:', error);

        // Handle specific MySQL errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                error: 'Email already registered'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error during registration'
        });
    }
};

// Get user profile by ID
exports.getUserProfile = async (req, res, next) => {

    const userId = req.user.id; // From authenticated token

    const db = new Database();
    const connection = db.connect();

    try {
        const [rows] = await connection.promise().query(
            'SELECT ID_Client as id, Email_Client as email, Nom_Client as nom, Prenom_Client as prenom, Numero_Telephone as numeroTelephone FROM Client WHERE ID_Client = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        console.log(rows[0])

        res.json({
            success: true,
            user: rows[0]
        });


    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    } finally {
        db.disconnect(connection);
    }
};

module.exports = {
    register: exports.register,
    getUserProfile: exports.getUserProfile,
    createUser,
    checkEmailExists,
    validateRegistrationData
};