const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');



// Get all content
router.get('/', contentController.getAllContent);

router.get('/page', contentController.getPageContent);

// Get content by menu path
router.get('/menu', contentController.getContentByMenuPath);

// Create new content
router.post('/', contentController.createContent);

// Update content
router.post('/:id', contentController.updateContent);

// Delete content
router.post('/delete/:id', contentController.deleteContent);

module.exports = router; 