const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Debug to find undefined routes
console.log('Menu Controller methods:', Object.keys(menuController));

// Menu routes
router.get('/', menuController.getAllMenus);
router.get('/:id', menuController.getMenuById);
router.post('/', menuController.createMenu);
router.post('/:id', menuController.updateMenu);
router.post('/delete/:id', menuController.deleteMenu);

// Mega menu routes
router.get('/:menuId/mega-menus', menuController.getMegaMenus);
router.get('/:menuId/mega-menus/:megaMenuId', menuController.getMegaMenu);
router.post('/:menuId/mega-menus', menuController.addMegaMenu);
router.post('/:menuId/mega-menus/:megaMenuId', menuController.updateMegaMenu);
router.post('/:menuId/mega-menus/:megaMenuId/delete', menuController.deleteMegaMenu);

// Add these routes for sub-mega menus
router.get('/:menuId/mega-menus/:megaMenuId/sub-menus', menuController.getSubMegaMenus);
router.get('/:menuId/mega-menus/:megaMenuId/sub-menus/:subMenuId', menuController.getSubMegaMenu);
router.post('/:menuId/mega-menus/:megaMenuId/sub-menus', menuController.addSubMegaMenu);
router.post('/:menuId/mega-menus/:megaMenuId/sub-menus/:subMenuId', menuController.updateSubMegaMenu);
router.post('/:menuId/mega-menus/:megaMenuId/sub-menus/:subMenuId/delete', menuController.deleteSubMegaMenu);

module.exports = router; 