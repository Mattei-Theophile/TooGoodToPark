
const database = require("../../database/database");

/**
 * Get all reviews for a specific car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getReviews(req, res) {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10, sortBy = 'Created_At', order = 'DESC' } = req.query;

        // Validate car exists
        const conn = new database.Database().connect();
        const [carExists] = await conn.promise().query(
            'SELECT ID_Car FROM Car WHERE ID_Car = ?',
            [id]
        );

        if (carExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Get reviews with client information
        const [reviews] = await conn.promise().query(`
            SELECT 
                r.ID_Review,
                r.Note_Review,
                r.Commentaire_Review,
                r.Created_At,
                c.Nom_Client,
                c.Prenom_Client
            FROM Review r
            JOIN Client c ON r.ID_client = c.ID_Client
            WHERE r.ID_car = ?
            ORDER BY r.${sortBy} ${order}
            LIMIT ? OFFSET ?
        `, [id, parseInt(limit), parseInt(offset)]);

        // Get total count for pagination
        const [countResult] = await conn.promise().query(
            'SELECT COUNT(*) as total FROM Review WHERE ID_car = ?',
            [id]
        );

        const totalReviews = countResult[0].total;

        // Calculate average rating
        const [avgRating] = await conn.promise().query(
            'SELECT AVG(Note_Review) as average_rating, COUNT(*) as review_count FROM Review WHERE ID_car = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            data: {
                reviews: reviews.map(review => ({
                    id: review.ID_Review,
                    rating: review.Note_Review,
                    comment: review.Commentaire_Review,
                    createdAt: review.Created_At,
                    reviewer: {
                        firstName: review.Prenom_Client,
                        lastName: review.Nom_Client
                    }
                })),
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNext: (page * limit) < totalReviews,
                    hasPrev: page > 1
                },
                stats: {
                    averageRating: parseFloat(avgRating[0].average_rating || 0).toFixed(1),
                    totalReviews: avgRating[0].review_count
                }
            }
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Create a new review for a car
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createReview(req, res) {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const clientId = req.user.id; // From auth middleware

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Validate car exists
        const [carExists] = await database.query(
            'SELECT ID_Car FROM Car WHERE ID_Car = ?',
            [id]
        );

        if (carExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Check if user already reviewed this car
        const [existingReview] = await database.query(
            'SELECT ID_Review FROM Review WHERE ID_client = ? AND ID_car = ?',
            [clientId, id]
        );

        if (existingReview.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'You have already reviewed this car'
            });
        }

        // Optional: Check if user has rented this car (business rule)
        const [hasRented] = await database.query(`
            SELECT r.ID_Reservation 
            FROM reservations r 
            WHERE r.ID_Client = ? AND r.ID_Car = ? 
            AND r.Date_End_Reservation < CURDATE()
        `, [clientId, id]);

        if (hasRented.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You can only review cars you have rented'
            });
        }

        // Create review
        const [result] = await database.query(
            'INSERT INTO Review (ID_client, ID_car, Note_Review, Commentaire_Review) VALUES (?, ?, ?, ?)',
            [clientId, id, rating, comment]
        );

        // Get the created review with user info
        const [newReview] = await database.query(`
            SELECT 
                r.ID_Review,
                r.Note_Review,
                r.Commentaire_Review,
                r.Created_At,
                c.Nom_Client,
                c.Prenom_Client
            FROM Review r
            JOIN Client c ON r.ID_client = c.ID_Client
            WHERE r.ID_Review = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: {
                id: newReview[0].ID_Review,
                rating: newReview[0].Note_Review,
                comment: newReview[0].Commentaire_Review,
                createdAt: newReview[0].Created_At,
                reviewer: {
                    firstName: newReview[0].Prenom_Client,
                    lastName: newReview[0].Nom_Client
                }
            }
        });

    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Update an existing review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateReview(req, res) {
    try {
        const { id } = req.params;
        const { reviewId, rating, comment } = req.body;
        const clientId = req.user.id;

        // Validation
        if (!reviewId) {
            return res.status(400).json({
                success: false,
                message: 'Review ID is required'
            });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if review exists and belongs to the user
        const [existingReview] = await database.query(
            'SELECT ID_Review, ID_client FROM Review WHERE ID_Review = ? AND ID_car = ?',
            [reviewId, id]
        );

        if (existingReview.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (existingReview[0].ID_client !== clientId) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own reviews'
            });
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];

        if (rating !== undefined) {
            updateFields.push('Note_Review = ?');
            updateValues.push(rating);
        }

        if (comment !== undefined) {
            updateFields.push('Commentaire_Review = ?');
            updateValues.push(comment);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateValues.push(reviewId);

        // Update review
        await database.query(
            `UPDATE Review SET ${updateFields.join(', ')} WHERE ID_Review = ?`,
            updateValues
        );

        // Get updated review
        const [updatedReview] = await database.query(`
            SELECT 
                r.ID_Review,
                r.Note_Review,
                r.Commentaire_Review,
                r.Created_At,
                c.Nom_Client,
                c.Prenom_Client
            FROM Review r
            JOIN Client c ON r.ID_client = c.ID_Client
            WHERE r.ID_Review = ?
        `, [reviewId]);

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: {
                id: updatedReview[0].ID_Review,
                rating: updatedReview[0].Note_Review,
                comment: updatedReview[0].Commentaire_Review,
                createdAt: updatedReview[0].Created_At,
                reviewer: {
                    firstName: updatedReview[0].Prenom_Client,
                    lastName: updatedReview[0].Nom_Client
                }
            }
        });

    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Delete a review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteReview(req, res) {
    try {
        const { id } = req.params;
        const { reviewId } = req.body;
        const clientId = req.user.id;

        if (!reviewId) {
            return res.status(400).json({
                success: false,
                message: 'Review ID is required'
            });
        }

        // Check if review exists and belongs to the user
        const [existingReview] = await database.query(
            'SELECT ID_Review, ID_client FROM Review WHERE ID_Review = ? AND ID_car = ?',
            [reviewId, id]
        );

        if (existingReview.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Allow users to delete their own reviews or admins to delete any review
        if (existingReview[0].ID_client !== clientId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own reviews'
            });
        }

        // Delete review
        await database.query(
            'DELETE FROM Review WHERE ID_Review = ?',
            [reviewId]
        );

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview
};