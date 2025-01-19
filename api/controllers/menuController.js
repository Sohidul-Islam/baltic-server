const { Menu, MegaMenu, Content } = require('../models');

const menuController = {
    // Get all menus with their mega menus
    getAllMenus: async (req, res) => {
        try {
            const menuItems = await Menu.findAll({
                include: [{
                    model: MegaMenu,
                    as: 'megaMenus',
                    include: [{
                        model: Content,
                        as: 'contents'
                    }]
                }]
            });
            res.json(menuItems);
        } catch (error) {
            console.error('Error fetching menus:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Get menu by ID
    getMenuById: async (req, res) => {
        try {
            const menu = await Menu.findByPk(req.params.id, {
                include: [{
                    model: MegaMenu,
                    as: 'megaMenus',
                    include: [{
                        model: Content,
                        as: 'contents'
                    }]
                }]
            });
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            res.json(menu);
        } catch (error) {
            console.error('Error fetching menu:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Create new menu
    createMenu: async (req, res) => {
        try {
            const { title, path, megaMenus } = req.body;
            const menu = await Menu.create({ title, path });

            if (megaMenus && megaMenus.length > 0) {
                const megaMenuPromises = megaMenus.map(mm => ({
                    ...mm,
                    menuId: menu.id
                }));
                await MegaMenu.bulkCreate(megaMenuPromises);
            }

            const menuWithMegaMenus = await Menu.findByPk(menu.id, {
                include: [{
                    model: MegaMenu,
                    as: 'megaMenus'
                }]
            });

            res.status(201).json(menuWithMegaMenus);
        } catch (error) {
            console.error('Error creating menu:', error);
            res.status(400).json({ message: error.message });
        }
    },

    // Update menu
    updateMenu: async (req, res) => {
        try {
            const { title, path, megaMenus } = req.body;
            const menu = await Menu.findByPk(req.params.id);

            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }

            await menu.update({ title, path });

            if (megaMenus) {
                await MegaMenu.destroy({ where: { menuId: menu.id } });
                const megaMenuPromises = megaMenus.map(mm => ({
                    ...mm,
                    menuId: menu.id
                }));
                await MegaMenu.bulkCreate(megaMenuPromises);
            }

            const updatedMenu = await Menu.findByPk(menu.id, {
                include: [{
                    model: MegaMenu,
                    as: 'megaMenus'
                }]
            });

            res.json(updatedMenu);
        } catch (error) {
            console.error('Error updating menu:', error);
            res.status(400).json({ message: error.message });
        }
    },

    // Delete menu
    deleteMenu: async (req, res) => {
        try {
            const menu = await Menu.findByPk(req.params.id);
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            await menu.destroy();
            res.json({ message: 'Menu deleted successfully' });
        } catch (error) {
            console.error('Error deleting menu:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = menuController; 