const express = require('express');
const router = express.Router();
const footerContentController = require('../controllers/footerContentController');

// Public route - Get active footer content
router.get('/', footerContentController.getFooterContent);

// Admin routes
router.get('/all', footerContentController.getAllFooterContents);
router.post('/', footerContentController.createFooterContent);
router.post('/:id', footerContentController.updateFooterContent);
router.post('/delete/:id', footerContentController.deleteFooterContent);

module.exports = router; 