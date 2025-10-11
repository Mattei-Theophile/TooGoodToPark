const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const database = require("../database/database");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../../uploads/cars');
fs.ensureDirSync(uploadDir);

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const carId = req.params.carId || req.params.id;
        const carDir = path.join(uploadDir, carId.toString());
        fs.ensureDirSync(carDir);
        cb(null, carDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `${timestamp}_${Math.random().toString(36).substring(7)}${extension}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 10 // Maximum 10 files
    }
});

/**
 * Upload multiple images for a car
 */
async function uploadCarImages(req, res) {
    try {
        const { carId } = req.params;
        const clientId = req.user.id;
        const conn = new database.Database().connect();
        // Validate car exists and user owns it
        const [car] = await conn.query(
            'SELECT ID_Car, ID_Seller FROM Car WHERE ID_Car = ?',
            [carId]
        );

        if (car.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        if (car[0].ID_Seller !== clientId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You can only upload images for your own cars'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images uploaded'
            });
        }

        const uploadedImages = [];

        for (const file of req.files) {
            try {
                // Get image dimensions
                const metadata = await sharp(file.path).metadata();

                // Create different sizes
                const sizes = await createImageSizes(file.path, file.filename);

                // Save to database
                const imageType = req.body.imageType || 'other';
                const description = req.body.description || '';
                const displayOrder = req.body.displayOrder || 0;

                const [result] = await database.query(`
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
                `, [
                    carId,
                    `/uploads/cars/${carId}/${file.filename}`,
                    file.filename,
                    file.originalname,
                    imageType,
                    description,
                    file.size,
                    metadata.width,
                    metadata.height,
                    path.extname(file.filename).substring(1),
                    displayOrder,
                    uploadedImages.length === 0 ? 1 : 0, // First image is primary
                    clientId
                ]);

                uploadedImages.push({
                    id: result.insertId,
                    filename: file.filename,
                    originalName: file.originalname,
                    path: `/uploads/cars/${carId}/${file.filename}`,
                    type: imageType,
                    size: file.size,
                    dimensions: {
                        width: metadata.width,
                        height: metadata.height
                    },
                    sizes: sizes
                });

            } catch (error) {
                console.error('Error processing image:', error);
                // Clean up file if database insert failed
                await fs.remove(file.path).catch(() => {});
            }
        }

        res.status(201).json({
            success: true,
            message: `${uploadedImages.length} images uploaded successfully`,
            data: uploadedImages
        });

    } catch (error) {
        console.error('Error uploading car images:', error);

        // Clean up uploaded files on error
        if (req.files) {
            for (const file of req.files) {
                await fs.remove(file.path).catch(() => {});
            }
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Create different image sizes (thumbnail, medium, large)
 */
async function createImageSizes(originalPath, filename) {
    const sizes = {};
    const baseName = path.parse(filename).name;
    const extension = path.parse(filename).ext;
    const directory = path.dirname(originalPath);

    const sizeConfigs = {
        thumbnail: { width: 150, height: 150, quality: 80 },
        medium: { width: 500, height: 400, quality: 85 },
        large: { width: 1200, height: 800, quality: 90 }
    };

    for (const [sizeName, config] of Object.entries(sizeConfigs)) {
        try {
            const newFilename = `${baseName}_${sizeName}${extension}`;
            const newPath = path.join(directory, newFilename);

            await sharp(originalPath)
                .resize(config.width, config.height, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: config.quality })
                .toFile(newPath);

            sizes[sizeName] = {
                filename: newFilename,
                width: config.width,
                height: config.height
            };
        } catch (error) {
            console.error(`Error creating ${sizeName} size:`, error);
        }
    }

    return sizes;
}


/**
 * Delete car image
 */
async function deleteCarImage(req, res) {
    try {
        const { carId, imageId } = req.params;
        const clientId = req.user.id;
        const conn = new database.Database().connect();
        // Validate car ownership
        const [car] = await conn.query(
            'SELECT ID_Seller FROM Car WHERE ID_Car = ?',
            [carId]
        );

        if (car.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        if (car[0].ID_Seller !== clientId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You can only delete images from your own cars'
            });
        }

        // Get image details
        const [image] = await database.query(
            'SELECT Image_Path, Image_Name FROM Car_Images WHERE ID_Image = ? AND ID_Car = ?',
            [imageId, carId]
        );

        if (image.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete from database
        await database.query(
            'DELETE FROM Car_Images WHERE ID_Image = ?',
            [imageId]
        );

        // Delete physical files
        const imagePath = path.join(__dirname, '../../../', image[0].Image_Path);
        const directory = path.dirname(imagePath);
        const baseName = path.parse(image[0].Image_Name).name;
        const extension = path.parse(image[0].Image_Name).ext;

        // Delete original and all sizes
        const filesToDelete = [
            imagePath,
            path.join(directory, `${baseName}_thumbnail${extension}`),
            path.join(directory, `${baseName}_medium${extension}`),
            path.join(directory, `${baseName}_large${extension}`)
        ];

        for (const filePath of filesToDelete) {
            await fs.remove(filePath).catch(() => {});
        }

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting car image:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Update image details
 */
async function updateCarImage(req, res) {
    try {
        const { carId, imageId } = req.params;
        const { description, type, displayOrder, isPrimary, altText } = req.body;
        const clientId = req.user.id;
        const conn = new database.Database().connect();
        // Validate car ownership
        const [car] = await conn.query(
            'SELECT ID_Seller FROM Car WHERE ID_Car = ?',
            [carId]
        );

        if (car.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        if (car[0].ID_Seller !== clientId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You can only update images from your own cars'
            });
        }

        // If setting as primary, remove primary status from other images
        if (isPrimary) {
            await database.query(
                'UPDATE Car_Images SET Is_Primary = 0 WHERE ID_Car = ?',
                [carId]
            );
        }

        // Build update query
        const updateFields = [];
        const updateValues = [];

        if (description !== undefined) {
            updateFields.push('Image_Description = ?');
            updateValues.push(description);
        }

        if (type !== undefined) {
            updateFields.push('Image_Type = ?');
            updateValues.push(type);
        }

        if (displayOrder !== undefined) {
            updateFields.push('Display_Order = ?');
            updateValues.push(displayOrder);
        }

        if (isPrimary !== undefined) {
            updateFields.push('Is_Primary = ?');
            updateValues.push(isPrimary ? 1 : 0);
        }

        if (altText !== undefined) {
            updateFields.push('Alt_Text = ?');
            updateValues.push(altText);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateValues.push(imageId);

        await database.query(
            `UPDATE Car_Images SET ${updateFields.join(', ')} WHERE ID_Image = ?`,
            updateValues
        );

        res.status(200).json({
            success: true,
            message: 'Image updated successfully'
        });

    } catch (error) {
        console.error('Error updating car image:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    upload,
    uploadCarImages,
    deleteCarImage,
    updateCarImage
};