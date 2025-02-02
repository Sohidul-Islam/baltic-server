const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

// Get all inquiries
router.get('/', inquiryController.getAllInquiries);

// Get single inquiry
router.get('/:id', inquiryController.getInquiry);

// Create new inquiry
router.post('/', inquiryController.createInquiry);

// Update inquiry status
router.post('/:id/status', inquiryController.updateInquiryStatus);

// Delete inquiry
router.post('/delete/:id', inquiryController.deleteInquiry);

module.exports = router; 