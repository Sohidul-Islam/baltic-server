const db = require('../db');
const { SubMegaMenu, Content, MegaMenu } = db;
const Response = require('../helpers/Response.helper');

const subMegaMenuController = {
    // Get all sub menus with filters
    getAllSubMenus: async (req, res, next) => {
        try {
            const { megaMenuId } = req.query;
            const where = megaMenuId ? { megaMenuId } : {};

            const subMenus = await SubMegaMenu.findAll({
                where,
                include: [
                    {
                        model: MegaMenu,
                        as: 'megaMenu',
                        attributes: ['id', 'title', 'path']
                    },
                    {
                        model: Content,
                        as: 'contents'
                    }
                ],
                order: [['title', 'ASC']]
            });

            return Response.success(res, subMenus, 'Sub menus retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Get single sub menu
    getSubMenu: async (req, res, next) => {
        try {
            const subMenu = await SubMegaMenu.findByPk(req.params.id, {
                include: [
                    {
                        model: MegaMenu,
                        as: 'megaMenu',
                        attributes: ['id', 'title', 'path']
                    },
                    {
                        model: Content,
                        as: 'contents'
                    }
                ]
            });

            if (!subMenu) {
                return Response.error(res, 'Sub menu not found', 404);
            }

            return Response.success(res, subMenu, 'Sub menu retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Create sub menu
    createSubMenu: async (req, res, next) => {
        try {
            const { title, path, items, megaMenuId } = req.body;

            // Check if mega menu exists
            const megaMenu = await MegaMenu.findByPk(megaMenuId);
            if (!megaMenu) {
                return Response.error(res, 'Mega menu not found', 404);
            }

            // Check for unique path
            const pathExists = await SubMegaMenu.findOne({ where: { path } });
            if (pathExists) {
                return Response.error(res, 'Path already exists', 400);
            }

            const subMenu = await SubMegaMenu.create({
                title,
                path,
                items: JSON.stringify(items),
                megaMenuId
            });

            const newSubMenu = await SubMegaMenu.findByPk(subMenu.id, {
                include: [
                    {
                        model: MegaMenu,
                        as: 'megaMenu',
                        attributes: ['id', 'title', 'path']
                    }
                ]
            });

            return Response.success(res, newSubMenu, 'Sub menu created successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    // Update sub menu
    updateSubMenu: async (req, res, next) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { title, path, items, megaMenuId } = req.body;
            const subMenu = await SubMegaMenu.findByPk(req.params.id);

            if (!subMenu) {
                await transaction.rollback();
                return Response.error(res, 'Sub menu not found', 404);
            }

            // Check for unique path
            const pathExists = await SubMegaMenu.findOne({
                where: {
                    path,
                    id: { [db.Sequelize.Op.ne]: req.params.id }
                }
            });

            if (pathExists) {
                await transaction.rollback();
                return Response.error(res, 'Path already exists', 400);
            }

            await subMenu.update({
                title,
                path,
                items: JSON.stringify(items),
                megaMenuId
            }, { transaction });

            const updatedSubMenu = await SubMegaMenu.findByPk(subMenu.id, {
                include: [
                    {
                        model: MegaMenu,
                        as: 'megaMenu',
                        attributes: ['id', 'title', 'path']
                    }
                ],
                transaction
            });

            await transaction.commit();
            return Response.success(res, updatedSubMenu, 'Sub menu updated successfully');
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    },

    // Delete sub menu
    deleteSubMenu: async (req, res, next) => {
        const transaction = await db.sequelize.transaction();
        try {
            const subMenu = await SubMegaMenu.findByPk(req.params.id);

            if (!subMenu) {
                await transaction.rollback();
                return Response.error(res, 'Sub menu not found', 404);
            }

            // Delete related content
            await Content.destroy({
                where: { subMegaMenuId: req.params.id },
                transaction
            });

            await subMenu.destroy({ transaction });
            await transaction.commit();

            return Response.success(res, null, 'Sub menu deleted successfully');
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }
};

module.exports = subMegaMenuController; 