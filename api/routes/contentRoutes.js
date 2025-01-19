const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Get all content
router.get('/', contentController.getAllContent);

// Get content by menu path
router.get('/menu/:path', contentController.getContentByMenuPath);

// Create new content
router.post('/', contentController.createContent);

// Update content
router.put('/:id', contentController.updateContent);

// Delete content
router.delete('/:id', contentController.deleteContent);

module.exports = router; 