const Response = require('../helpers/Response.helper');
const ImageUploadHelper = require('../helpers/ImageUpload.helper');
const path = require('path');
const fs = require('fs/promises');

const imageController = {
    // Upload single image
    uploadImage: async (req, res, next) => {
        try {
            if (!req.file) {
                return Response.error(res, 'No image file provided', 400);
            }

            // Process image with different sizes
            const [originalUrl, thumbnailUrl] = await Promise.all([
                // Original image (max width 800px)
                ImageUploadHelper.processAndSaveImage(req.file, {
                    width: 800,
                    format: 'webp',
                    quality: 80
                }),
                // Thumbnail (width 200px)
                ImageUploadHelper.processAndSaveImage(req.file, {
                    width: 200,
                    format: 'webp',
                    quality: 70
                })
            ]);

            return Response.success(res, {
                original: originalUrl,
                thumbnail: thumbnailUrl
            }, 'Image uploaded successfully', 201);

        } catch (error) {
            if (error.message.includes('File too large')) {
                return Response.error(res, 'Image size should not exceed 2MB', 400);
            }
            next(error);
        }
    },

    // Upload multiple images
    uploadMultipleImages: async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                return Response.error(res, 'No images provided', 400);
            }

            const uploadPromises = req.files.map(async (file) => {
                const [originalUrl, thumbnailUrl] = await Promise.all([
                    ImageUploadHelper.processAndSaveImage(file, {
                        width: 800,
                        format: 'png',
                        quality: 80
                    }),
                    ImageUploadHelper.processAndSaveImage(file, {
                        width: 200,
                        format: 'webp',
                        quality: 70
                    })
                ]);

                return {
                    original: originalUrl,
                    thumbnail: thumbnailUrl
                };
            });

            const results = await Promise.all(uploadPromises);
            return Response.success(res, results, 'Images uploaded successfully', 201);

        } catch (error) {
            if (error.message.includes('File too large')) {
                return Response.error(res, 'Each image size should not exceed 2MB', 400);
            }
            next(error);
        }
    },

    // Delete image
    deleteImage: async (req, res, next) => {
        try {
            const { filename } = req.params;
            const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

            // Check if file exists
            try {
                await fs.access(filepath);
            } catch (error) {
                return Response.error(res, 'Image not found', 404);
            }

            // Delete the file
            await fs.unlink(filepath);
            return Response.success(res, null, 'Image deleted successfully');

        } catch (error) {
            next(error);
        }
    }
};

module.exports = imageController; 