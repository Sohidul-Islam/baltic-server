const db = require('../db');
const { Menu, MegaMenu, Content, SubMegaMenu } = db;
const Response = require('../helpers/Response.helper');

const menuController = {
    // Get all menus with their mega menus
    getAllMenus: async (req, res, next) => {
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
            return Response.success(res, menuItems, 'Menus retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Get menu by ID
    getMenuById: async (req, res, next) => {
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
                return Response.error(res, 'Menu not found', 404);
            }
            return Response.success(res, menu, 'Menu retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Create new menu
    createMenu: async (req, res, next) => {
        try {
            const { title, path, megaMenus } = req.body;

            const isPathExist = await Menu.findOne({
                where: { path }
            }) || await MegaMenu.findOne({
                where: { path }
            })

            if (isPathExist) {
                return Response.error(res, 'Path should be unique', 500);
            }

            const menu = await Menu.create({ title, path });

            if (megaMenus?.length > 0) {
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

            return Response.success(res, menuWithMegaMenus, 'Menu created successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    // Update menu
    updateMenu: async (req, res, next) => {
        try {
            const { title, path, megaMenus } = req.body;

            // Start transaction
            const transaction = await db.sequelize.transaction();

            try {
                const menu = await Menu.findByPk(req.params.id);

                if (!menu) {
                    await transaction.rollback();
                    return Response.error(res, 'Menu not found', 404);
                }

                const menuExist = await Menu.findOne({
                    where: { path }
                });

                const megaMenuExist = await MegaMenu.findOne({
                    where: { path }
                });

                if ((menuExist || megaMenuExist) && menuExist?.dataValues?.id !== Number(req.params.id)) {
                    await transaction.rollback();
                    return Response.error(res, 'Path should be unique', 500);
                }

                await menu.update({ title, path }, { transaction });

                if (megaMenus) {
                    // Get existing mega menu IDs
                    const existingMegaMenus = await MegaMenu.findAll({
                        where: { menuId: menu.id },
                        attributes: ['id']
                    });
                    const megaMenuIds = existingMegaMenus.map(mm => mm.id);

                    // Delete associated content first
                    await Content.destroy({
                        where: {
                            megaMenuId: megaMenuIds
                        },
                        transaction
                    });

                    // Then delete mega menus
                    await MegaMenu.destroy({
                        where: { menuId: menu.id },
                        transaction
                    });

                    // Create new mega menus
                    const megaMenuPromises = megaMenus.map(mm => ({
                        ...mm,
                        menuId: menu.id
                    }));
                    await MegaMenu.bulkCreate(megaMenuPromises, { transaction });
                }

                const updatedMenu = await Menu.findByPk(menu.id, {
                    include: [{
                        model: MegaMenu,
                        as: 'megaMenus'
                    }],
                    transaction
                });

                await transaction.commit();
                return Response.success(res, updatedMenu, 'Menu updated successfully');
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            next(error);
        }
    },

    // Delete menu
    deleteMenu: async (req, res, next) => {
        try {
            const transaction = await db.sequelize.transaction();

            try {
                const menu = await Menu.findByPk(req.params.id, {
                    include: [
                        {
                            model: MegaMenu,
                            as: 'megaMenus',
                            include: [{
                                model: Content,
                                as: 'contents'
                            }]
                        },
                        {
                            model: Content,
                            as: 'contents'
                        }
                    ]
                });

                if (!menu) {
                    await transaction.rollback();
                    return Response.error(res, 'Menu not found', 404);
                }

                // Get all mega menu IDs associated with this menu
                const megaMenuIds = menu.megaMenus.map(mm => mm.id);

                // Delete all content associated with both menu and mega menus
                await Content.destroy({
                    where: {
                        [db.Sequelize.Op.or]: [
                            { menuId: menu.id },
                            { megaMenuId: { [db.Sequelize.Op.in]: megaMenuIds } }
                        ]
                    },
                    transaction
                });

                // Delete all mega menus
                await MegaMenu.destroy({
                    where: { menuId: menu.id },
                    transaction
                });

                // Finally delete the menu
                await menu.destroy({ transaction });

                await transaction.commit();
                return Response.success(res, null, 'Menu and all related items deleted successfully');
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            next(error);
        }
    },

    // Add mega menu to a menu
    addMegaMenu: async (req, res, next) => {
        try {

            const { title, path, items, menuId } = req.body;

            // Check if menu exists
            const menu = await Menu.findByPk(menuId);
            if (!menu) {
                return Response.error(res, 'Menu not found', 404);
            }

            const isPathExist = await Menu.findOne({
                where: { path }
            }) || await MegaMenu.findOne({
                where: { path }
            })

            if (isPathExist) {
                return Response.error(res, 'Path should be unique', 500);
            }

            // Create mega menu
            const megaMenu = await MegaMenu.create({
                title,
                path,
                items: JSON.stringify(items),
                menuId
            });

            const megaMenuWithRelations = await MegaMenu.findByPk(megaMenu.id, {
                include: [{
                    model: Content,
                    as: 'contents'
                }]
            });

            return Response.success(res, megaMenuWithRelations, 'Mega menu created successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    // Update mega menu
    updateMegaMenu: async (req, res, next) => {
        try {
            const { menuId, megaMenuId } = req.params;
            const { title, path, items } = req.body;

            // Check if mega menu exists and belongs to menu
            const megaMenu = await MegaMenu.findOne({
                where: { id: megaMenuId, menuId }
            });

            if (!megaMenu) {
                return Response.error(res, 'Mega menu not found', 404);
            }

            const menuExist = await Menu.findOne({
                where: { path }
            });

            const megaMenuExist = await MegaMenu.findOne({
                where: { path }
            })


            if ((menuExist || megaMenuExist) && megaMenuExist?.dataValues?.id !== Number(megaMenuId)) {
                return Response.error(res, 'Path should be unique', 500);
            }

            await megaMenu.update({
                title,
                path,
                items: JSON.stringify(items)
            });

            const updatedMegaMenu = await MegaMenu.findByPk(megaMenu.id, {
                include: [{
                    model: Content,
                    as: 'contents'
                }]
            });

            return Response.success(res, updatedMegaMenu, 'Mega menu updated successfully');
        } catch (error) {
            next(error);
        }
    },

    // Delete mega menu
    deleteMegaMenu: async (req, res, next) => {
        try {
            const { menuId, megaMenuId } = req.params;

            // Start a transaction
            const transaction = await db.sequelize.transaction();

            try {
                // First, find the mega menu
                const megaMenu = await MegaMenu.findOne({
                    where: { id: megaMenuId, menuId },
                    include: [{
                        model: Content,
                        as: 'contents'
                    }]
                });

                if (!megaMenu) {
                    await transaction.rollback();
                    return Response.error(res, 'Mega menu not found', 404);
                }

                // Delete all related content first
                await Content.destroy({
                    where: { megaMenuId },
                    transaction
                });

                // Then delete the mega menu
                await megaMenu.destroy({ transaction });

                // If everything went well, commit the transaction
                await transaction.commit();

                return Response.success(res, null, 'Mega menu and related content deleted successfully');
            } catch (error) {
                // If anything goes wrong, rollback the transaction
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            next(error);
        }
    },

    // Get all mega menus for a menu
    getMegaMenus: async (req, res, next) => {
        try {
            const { menuId } = req.params;

            const menu = await Menu.findByPk(menuId, {
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
                return Response.error(res, 'Menu not found', 404);
            }

            return Response.success(res, menu.megaMenus, 'Mega menus retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Get single mega menu with its contents
    getMegaMenu: async (req, res, next) => {
        try {
            const { menuId, megaMenuId } = req.params;

            const megaMenu = await MegaMenu.findOne({
                where: { id: megaMenuId, menuId },
                include: [{
                    model: Content,
                    as: 'contents'
                }]
            });

            if (!megaMenu) {
                return Response.error(res, 'Mega menu not found', 404);
            }

            return Response.success(res, megaMenu, 'Mega menu retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Get all sub mega menus for a mega menu
    getSubMegaMenus: async (req, res, next) => {
        try {
            const { menuId, megaMenuId } = req.params;

            const megaMenu = await MegaMenu.findOne({
                where: { id: megaMenuId, menuId },
                include: [{
                    model: SubMegaMenu,
                    as: 'subMegaMenus',
                    include: [{
                        model: Content,
                        as: 'contents'
                    }]
                }]
            });

            if (!megaMenu) {
                return Response.error(res, 'Mega menu not found', 404);
            }

            return Response.success(res, megaMenu.subMegaMenus, 'Sub mega menus retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Get single sub mega menu
    getSubMegaMenu: async (req, res, next) => {
        try {
            const { menuId, megaMenuId, subMenuId } = req.params;

            const subMegaMenu = await SubMegaMenu.findOne({
                where: {
                    id: subMenuId,
                    megaMenuId
                },
                include: [{
                    model: Content,
                    as: 'contents'
                }]
            });

            if (!subMegaMenu) {
                return Response.error(res, 'Sub mega menu not found', 404);
            }

            return Response.success(res, subMegaMenu, 'Sub mega menu retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Add sub mega menu
    addSubMegaMenu: async (req, res, next) => {
        try {
            const { menuId, megaMenuId } = req.params;
            const { title, path, items } = req.body;

            // Check if mega menu exists
            const megaMenu = await MegaMenu.findOne({
                where: { id: megaMenuId, menuId }
            });

            if (!megaMenu) {
                return Response.error(res, 'Mega menu not found', 404);
            }

            // Check for unique path
            const isPathExist = await Menu.findOne({ where: { path } }) ||
                await MegaMenu.findOne({ where: { path } }) ||
                await SubMegaMenu.findOne({ where: { path } });

            if (isPathExist) {
                return Response.error(res, 'Path should be unique', 500);
            }

            // Create sub mega menu
            const subMegaMenu = await SubMegaMenu.create({
                title,
                path,
                items: JSON.stringify(items),
                megaMenuId
            });

            const subMegaMenuWithRelations = await SubMegaMenu.findByPk(subMegaMenu.id, {
                include: [{
                    model: Content,
                    as: 'contents'
                }]
            });

            return Response.success(res, subMegaMenuWithRelations, 'Sub mega menu created successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    // Update sub mega menu
    updateSubMegaMenu: async (req, res, next) => {
        try {
            const { menuId, megaMenuId, subMenuId } = req.params;
            const { title, path, items } = req.body;

            const transaction = await db.sequelize.transaction();

            try {
                const subMegaMenu = await SubMegaMenu.findOne({
                    where: {
                        id: subMenuId,
                        megaMenuId
                    }
                });

                if (!subMegaMenu) {
                    await transaction.rollback();
                    return Response.error(res, 'Sub mega menu not found', 404);
                }

                // Check for unique path
                const pathExists = await SubMegaMenu.findOne({
                    where: {
                        path,
                        id: { [db.Sequelize.Op.ne]: subMenuId }
                    }
                });

                if (pathExists) {
                    await transaction.rollback();
                    return Response.error(res, 'Path should be unique', 500);
                }

                await subMegaMenu.update({
                    title,
                    path,
                    items: JSON.stringify(items)
                }, { transaction });

                const updatedSubMenu = await SubMegaMenu.findByPk(subMenuId, {
                    include: [{
                        model: Content,
                        as: 'contents'
                    }],
                    transaction
                });

                await transaction.commit();
                return Response.success(res, updatedSubMenu, 'Sub mega menu updated successfully');
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            next(error);
        }
    },

    // Delete sub mega menu
    deleteSubMegaMenu: async (req, res, next) => {
        try {
            const { menuId, megaMenuId, subMenuId } = req.params;
            const transaction = await db.sequelize.transaction();

            try {
                const subMegaMenu = await SubMegaMenu.findOne({
                    where: {
                        id: subMenuId,
                        megaMenuId
                    },
                    include: [{
                        model: Content,
                        as: 'contents'
                    }]
                });

                if (!subMegaMenu) {
                    await transaction.rollback();
                    return Response.error(res, 'Sub mega menu not found', 404);
                }

                // Delete all related content first
                await Content.destroy({
                    where: { subMegaMenuId: subMenuId },
                    transaction
                });

                // Delete the sub mega menu
                await subMegaMenu.destroy({ transaction });

                await transaction.commit();
                return Response.success(res, null, 'Sub mega menu and related content deleted successfully');
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            next(error);
        }
    }
};

module.exports = menuController; 