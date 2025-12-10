const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs-extra");
const axios = require("axios");
const database = require("../../database/database");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads", "cars");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const carId = req.params.carId;

    let finalDir = uploadDir;
    if (carId) {
      finalDir = path.join(uploadDir, carId.toString());
    } else {
      finalDir = path.join(uploadDir, "temp");
    }
    fs.ensureDirSync(finalDir);
    cb(null, finalDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${timestamp}_${Math.random().toString(36).substring(7)}${extension}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

/**
 * Helper: Validate car exists and user has access (Owner or Admin)
 */
async function validateCarAccess(conn, carId, user) {
  if (!carId) {
    return { valid: false, status: 400, message: "Car ID is required" };
  }

  const [car] = await conn
    .promise()
    .query("SELECT ID_Car, ID_Seller FROM Car WHERE ID_Car = ?", [carId]);

  if (car.length === 0) {
    return { valid: false, status: 404, message: "Car not found" };
  }

  if (car[0].ID_Seller !== user.id && user.role !== "admin") {
    return {
      valid: false,
      status: 403,
      message: "You can only manage images for your own cars",
    };
  }

  return { valid: true, car: car[0] };
}

/**
 * Helper: Process a single base64 or URL image
 * OPTIMIZED: Parallel processing, reduced quality for faster compression
 */
async function processBase64OrUrlImage(imageData, carId, userId, options) {
  try {
    let buffer;
    let filename;
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);

    if (typeof imageData !== "string") {
      console.error("Invalid image data type:", typeof imageData);
      return null;
    }

    if (imageData.startsWith("http")) {
      // Handle URL with timeout
      console.log("Processing URL:", imageData.substring(0, 100) + "...");
      console.log("URL Length:", imageData.length);

      if (imageData.length > 2048) {
        console.error(
          "⚠️ URL is suspiciously long! Check if Base64 data is mistakenly included.",
        );
      }
      const response = await axios.get(imageData, {
        responseType: "arraybuffer",
        timeout: 10000, //10 second timeout
        maxContentLength: 100 * 1024 * 1024, // 100MB max
      });
      buffer = Buffer.from(response.data, "binary");
      const contentType = response.headers["content-type"];
      const ext = contentType ? contentType.split("/")[1] : "jpg";
      filename = `${timestamp}_${randomStr}.${ext}`;
    } else if (imageData.startsWith("data:image")) {
      // Handle Base64
      const matches = imageData.match(
        /^data:image\/([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!matches || matches.length !== 3) {
        console.error("Invalid base64 string");
        return null;
      }
      const ext = matches[1];
      buffer = Buffer.from(matches[2], "base64");
      filename = `${timestamp}_${randomStr}.${ext}`;
    } else {
      console.error("Invalid image data format (not http or data:image)");
      return null;
    }

    // Save file to disk
    const carDir = path.join(uploadDir, carId.toString());
    fs.ensureDirSync(carDir);
    const filePath = path.join(carDir, filename);
    await fs.outputFile(filePath, buffer);

    // Create mock file object to reuse processSingleImage logic
    const file = {
      path: filePath,
      filename: filename,
      originalname: filename,
      size: buffer.length,
    };

    const conn = new database.Database().connect();
    const result = await processSingleImage(
      conn,
      file,
      carId,
      userId,
      options,
      false,
    );
    return result;
  } catch (error) {
    console.error("Error processing base64/URL image:", error);
    return null;
  }
}

/**
 * Helper: Process a single image file (resize, metadata, db insert)
 * OPTIMIZED: Parallel processing, batch operations
 */
async function processSingleImage(
  conn,
  file,
  carId,
  userId,
  options,
  isPrimary,
) {
  try {
    // Check if file ended up in 'temp' or wrong directory and move it if necessary
    let currentPath = file.path;
    const correctDir = path.join(uploadDir, carId.toString());
    const correctPath = path.join(correctDir, file.filename);

    if (path.dirname(currentPath) !== correctDir) {
      console.log(`Moving file from ${currentPath} to ${correctPath}`);
      fs.ensureDirSync(correctDir);
      await fs.move(currentPath, correctPath, { overwrite: true });
      file.path = correctPath;
      currentPath = correctPath;
    }

    // Parallel execution: metadata extraction and image resizing
    const [metadata, sizes] = await Promise.all([
      sharp(file.path).metadata(),
      createImageSizes(file.path, file.filename),
    ]);

    const imageType = options.imageType || "other";
    const description = options.description || "";
    const displayOrder = options.displayOrder || 0;
    const imagePath = `/uploads/cars/${carId}/${file.filename}`;

    const [result] = await conn.promise().query(
      `INSERT INTO Car_Images (
          ID_Car, Image_Path, Image_Name, Original_Name, Image_Type, 
          Image_Description, Image_Size, Image_Width, Image_Height, 
          Image_Format, Display_Order, Is_Primary, Uploaded_By
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        carId,
        imagePath,
        file.filename,
        file.originalname,
        imageType,
        description,
        file.size,
        metadata.width,
        metadata.height,
        path.extname(file.filename).substring(1),
        displayOrder,
        isPrimary ? 1 : 0,
        userId,
      ],
    );

    return {
      id: result.insertId,
      filename: file.filename,
      originalName: file.originalname,
      path: imagePath,
      type: imageType,
      size: file.size,
      dimensions: { width: metadata.width, height: metadata.height },
      sizes: sizes,
    };
  } catch (error) {
    console.error(`Error processing image ${file.filename}:`, error);
    await fs.remove(file.path).catch(() => {});
    return null;
  }
}

/**
 * Helper: Delete physical files for an image
 * OPTIMIZED: Parallel deletion
 */
async function deletePhysicalImageFiles(imageRelativePath, imageName) {
  try {
    console.log("Deleting physical image files:", imageRelativePath);
    console.log("Image Name:", imageName);
    const imagePath = path.join(process.cwd(), imageRelativePath);
    const directory = path.dirname(imagePath);
    const baseName = path.parse(imageName).name;
    const extension = path.parse(imageName).ext;

    const filesToDelete = [
      imagePath,
      path.join(directory, `${baseName}_thumbnail${extension}`),
      path.join(directory, `${baseName}_medium${extension}`),
      path.join(directory, `${baseName}_large${extension}`),
    ];

    // Delete all files in parallel
    await Promise.allSettled(filesToDelete.map((fp) => fs.remove(fp)));
  } catch (error) {
    console.error("Error removing files:", error);
  }
}

/**
 * Service: Upload multiple images for a car (Backend use)
 * OPTIMIZED: Parallel processing of all images
 */
async function uploadCarImages(req, res) {
  const { carId } = req.params;
  const user = req.user;
  const files = req.files || [];

  let bodyImages = [];
  if (req.body.images) {
    if (Array.isArray(req.body.images)) {
      bodyImages = req.body.images;
    } else if (typeof req.body.images === "string") {
      bodyImages = [req.body.images];
    }
  }

  const options = req.body;

  if (!carId) {
    return res
      .status(400)
      .json({ success: false, message: "Car ID is required" });
  }

  const conn = new database.Database().connect();
  try {
    const access = await validateCarAccess(conn, carId, user);
    if (!access.valid) {
      return res
        .status(access.status)
        .json({ success: false, message: access.message });
    }

    if (files.length === 0 && bodyImages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    // Process all images in parallel
    const filePromises = files.map((file, i) =>
      processSingleImage(
        conn,
        file,
        carId,
        user.id,
        options,
        i === 0 && bodyImages.length === 0,
      ),
    );

    const bodyImagePromises = bodyImages.map((img) =>
      processBase64OrUrlImage(img, carId, user.id, options),
    );

    const allResults = await Promise.allSettled([
      ...filePromises,
      ...bodyImagePromises,
    ]);

    const uploadedImages = allResults
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value);

    // Update primary status for first image if needed
    if (uploadedImages.length > 0 && !uploadedImages[0].isPrimary) {
      await conn
        .promise()
        .query("UPDATE Car_Images SET Is_Primary = 1 WHERE ID_Image = ?", [
          uploadedImages[0].id,
        ]);
      uploadedImages[0].isPrimary = true;
    }

    return res.status(201).json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: uploadedImages,
    });
  } catch (error) {
    console.error("Error uploading car images:", error);
    if (files) {
      await Promise.allSettled(files.map((file) => fs.remove(file.path)));
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Service: Update car images (Replace all)
 * OPTIMIZED: Parallel processing and batch operations
 */
async function updateCarImages(req, res) {
  const { carId } = req.params;
  const user = req.user;
  const files = req.files || [];

  console.log("Updating car images:", carId, files);

  let bodyImages = [];
  if (req.body.images) {
    if (Array.isArray(req.body.images)) {
      bodyImages = req.body.images;
    } else if (typeof req.body.images === "string") {
      bodyImages = [req.body.images];
    }
  }

  const options = req.body;

  if (!carId) {
    return res
      .status(400)
      .json({ success: false, message: "Car ID is required" });
  }

  const conn = new database.Database().connect();
  try {
    // 1. Validate Access
    const access = await validateCarAccess(conn, carId, user);
    if (!access.valid) {
      if (files) await Promise.allSettled(files.map((f) => fs.remove(f.path)));
      return res
        .status(access.status)
        .json({ success: false, message: access.message });
    }

    // 2. Get existing images to delete
    const [existingImages] = await conn
      .promise()
      .query(
        "SELECT ID_Image, Image_Path, Image_Name FROM Car_Images WHERE ID_Car = ?",
        [carId],
      );

    // Identify images to keep
    const imagesToKeep = new Set();
    const existingImagePaths = new Set(
      existingImages.map((img) => img.Image_Path),
    );

    const getPathFromUrl = (url) => {
      if (typeof url !== "string") return null;
      const match = url.match(new RegExp(`/uploads/cars/${carId}/([^/]+)$`));
      return match ? `/uploads/cars/${carId}/${match[1]}` : null;
    };

    for (const imgData of bodyImages) {
      const p = getPathFromUrl(imgData);
      if (p && existingImagePaths.has(p)) {
        imagesToKeep.add(p);
      }
    }

    // 3. Delete existing images from DB
    if (existingImages.length > 0) {
      await conn
        .promise()
        .query("DELETE FROM Car_Images WHERE ID_Car = ?", [carId]);

      // Delete physical files in parallel (only those not kept)
      const deletePromises = existingImages
        .filter((img) => !imagesToKeep.has(img.Image_Path))
        .map((img) => deletePhysicalImageFiles(img.Image_Path, img.Image_Name));

      await Promise.allSettled(deletePromises);
    }

    // 4. Upload new files
    if (files.length === 0 && bodyImages.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All images removed",
        data: [],
      });
    }

    // Process all images in parallel
    const filePromises = files.map((file, i) =>
      processSingleImage(conn, file, carId, user.id, options, i === 0),
    );

    const bodyImagePromises = bodyImages.map(async (imgData) => {
      const imgPath = getPathFromUrl(imgData);

      if (imgPath && imagesToKeep.has(imgPath)) {
        // Reuse existing file
        const filename = path.basename(imgPath);
        const filePath = path.join(uploadDir, carId.toString(), filename);

        if (await fs.pathExists(filePath)) {
          const stat = await fs.stat(filePath);
          const file = {
            path: filePath,
            filename: filename,
            originalname: filename,
            size: stat.size,
          };
          return processSingleImage(conn, file, carId, user.id, options, false);
        }
      } else {
        // New image
        console.log("Processing new image:", imgData);
        return processBase64OrUrlImage(imgData, carId, user.id, options);
      }
      return null;
    });

    const allResults = await Promise.allSettled([
      ...filePromises,
      ...bodyImagePromises,
    ]);

    const uploadedImages = allResults
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value);

    // Update primary status for first image
    if (uploadedImages.length > 0) {
      await conn
        .promise()
        .query("UPDATE Car_Images SET Is_Primary = 1 WHERE ID_Image = ?", [
          uploadedImages[0].id,
        ]);
      uploadedImages[0].isPrimary = true;
    }

    return res.status(200).json({
      success: true,
      message: "Images updated successfully",
      data: uploadedImages,
    });
  } catch (error) {
    console.error("Error updating car images:", error);
    if (files) {
      await Promise.allSettled(files.map((file) => fs.remove(file.path)));
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Create different image sizes (thumbnail, medium, large)
 * OPTIMIZED: Parallel resizing, reduced quality, optimized sharp settings
 */
async function createImageSizes(originalPath, filename) {
  const baseName = path.parse(filename).name;
  const extension = path.parse(filename).ext;
  const directory = path.dirname(originalPath);

  const sizeConfigs = {
    thumbnail: { width: 150, height: 150, quality: 70 }, // Reduced quality
    medium: { width: 500, height: 400, quality: 75 }, // Reduced quality
    large: { width: 1200, height: 800, quality: 80 }, // Reduced quality
  };

  // Process all sizes in parallel
  const sizePromises = Object.entries(sizeConfigs).map(
    async ([sizeName, config]) => {
      try {
        const newFilename = `${baseName}_${sizeName}${extension}`;
        const newPath = path.join(directory, newFilename);

        await sharp(originalPath)
          .resize(config.width, config.height, {
            fit: "cover",
            position: "center",
          })
          .jpeg({
            quality: config.quality,
            progressive: true, // Progressive loading
            mozjpeg: true, // Use mozjpeg for better compression
          })
          .toFile(newPath);

        return [
          sizeName,
          {
            filename: newFilename,
            width: config.width,
            height: config.height,
          },
        ];
      } catch (error) {
        console.error(`Error creating ${sizeName} size:`, error);
        return null;
      }
    },
  );

  const results = await Promise.allSettled(sizePromises);

  const sizes = {};
  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      const [sizeName, sizeData] = result.value;
      sizes[sizeName] = sizeData;
    }
  });

  return sizes;
}

/**
 * Service: Delete car image (Backend use)
 */
async function deleteCarImage(req, res) {
  const { carId, imageUrl } = req.params;
  if (!carId) {
    return res
      .status(400)
      .json({ success: false, message: "Car ID is required" });
  }

  const user = req.user;

  const conn = new database.Database().connect();
  try {
    const access = await validateCarAccess(conn, carId, user);
    if (!access.valid) {
      return res
        .status(access.status)
        .json({ success: false, message: access.message });
    }

    console.log("Deleting image:", imageUrl, " cardId", carId);
    const [image] = await conn
      .promise()
      .query(
        "SELECT Image_Path, Image_Name FROM Car_Images WHERE Image_Name = ? AND ID_Car = ?",
        [imageUrl, carId],
      );

    if (image.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }
    console.log("Image found:", image[0]);
    // Execute deletion in parallel
    await Promise.all([
      conn
        .promise()
        .query("DELETE FROM Car_Images WHERE Image_Name = ?", [
          image[0].Image_Name,
        ]),
      deletePhysicalImageFiles(image[0].Image_Path, image[0].Image_Name),
    ]);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  upload,
  uploadCarImages,
  deleteCarImage,
  updateCarImages,
};
