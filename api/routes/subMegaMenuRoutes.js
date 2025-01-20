const express = require('express');
const router = express.Router();
const subMegaMenuController = require('../controllers/subMegaMenuController');

// Debug to find undefined routes
console.log('Controller methods:', Object.keys(subMegaMenuController));

// Get all sub menus (with optional megaMenuId filter)
router.get('/', subMegaMenuController.getAllSubMenus);

// Get single sub menu
router.get('/:id', subMegaMenuController.getSubMenu);

// Create sub menu
router.post('/', subMegaMenuController.createSubMenu);

// Update sub menu
router.post('/:id', subMegaMenuController.updateSubMenu);

// Delete sub menu
router.post('/delete/:id', subMegaMenuController.deleteSubMenu);

module.exports = router; 