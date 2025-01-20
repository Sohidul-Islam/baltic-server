const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const ImageUploadHelper = require('../helpers/ImageUpload.helper');

// Debug to find undefined routes
console.log('Image Controller methods:', Object.keys(imageController));

// Single image upload
router.post('/upload',
    ImageUploadHelper.getUploadMiddleware(),
    imageController.uploadImage
);

// Multiple images upload
router.post('/upload-multiple',
    ImageUploadHelper.getMultipleUploadMiddleware(),
    imageController.uploadMultipleImages
);

// Delete image
router.post('/delete/:filename',
    imageController.deleteImage
);

module.exports = router; 