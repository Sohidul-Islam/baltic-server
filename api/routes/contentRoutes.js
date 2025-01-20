const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Debug to find undefined routes
console.log('Content Controller methods:', Object.keys(contentController));

// Get all content
router.get('/', contentController.getAllContent);

// Get content by menu path
router.get('/menu', contentController.getContentByMenuPath);

// Create new content
router.post('/', contentController.createContent);

// Update content
router.post('/:id', contentController.updateContent);

// Delete content
router.post('/delete/:id', contentController.deleteContent);

module.exports = router; 