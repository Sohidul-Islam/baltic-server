const db = require('../db');
const { Content, Menu, MegaMenu, SubMegaMenu } = db;
const Response = require('../helpers/Response.helper');


const contentController = {
    // Get all content
    getAllContent: async (req, res, next) => {
        try {
            const { menuId, megaMenuId, subMegaMenuId, contentId } = req.query;
            const whereClause = {};
            if (menuId) whereClause.menuId = menuId;
            if (megaMenuId) whereClause.megaMenuId = megaMenuId;
            if (subMegaMenuId) whereClause.subMegaMenuId = subMegaMenuId;
            if (contentId) whereClause.id = contentId;

            const content = await Content.findAll({
                where: whereClause,
                include: [
                    {
                        model: Menu,
                        as: 'menu'
                    },
                    {
                        model: MegaMenu,
                        as: 'megaMenu'
                    }
                ]
            });
            return Response.success(res, content, 'Content retrieved successfully');
        } catch (error) {
            next(error);
        }
    },


    getPageContent: async (req, res, next) => {
        try {
            const { path } = req.query;

            const whereClause = {};
            let menuId = null;
            let megaMenuId = null;
            let subMegaMenuId = null;
            let contentId = null;


            const menuData = await Menu.findOne({
                where: { path }
            })

            const megaMenuData = await MegaMenu.findOne({
                where: { path }
            })

            const subMegaMenuData = await SubMegaMenu.findOne({
                where: { path }
            })

            if (menuData) {
                menuId = menuData?.dataValues?.id;
            }

            if (megaMenuData) {
                megaMenuId = megaMenuData?.dataValues?.id
            }

            if (subMegaMenuData) {
                subMegaMenuId = subMegaMenuData?.dataValues?.id
            }

            if (menuId) whereClause.menuId = menuId;
            if (megaMenuId) whereClause.megaMenuId = megaMenuId;
            if (subMegaMenuId) whereClause.subMegaMenuId = subMegaMenuId;
            if (contentId) whereClause.id = contentId;


            const isEmptyObject = Object.keys(whereClause).length === 0;

            const content = isEmptyObject ? [] : await Content.findAll({
                where: whereClause,
                include: [
                    {
                        model: Menu,
                        as: 'menu'
                    },
                    {
                        model: MegaMenu,
                        as: 'megaMenu'
                    }
                ]
            });
            return Response.success(res, content, 'Content retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Get content by menu path
    getContentByMenuPath: async (req, res, next) => {
        try {
            const { menuId, megaMenuId, subMegaMenuId } = req.query;
            const whereClause = {};
            if (menuId) whereClause.menuId = menuId;
            if (megaMenuId) whereClause.megaMenuId = megaMenuId;
            if (subMegaMenuId) whereClause.subMegaMenuId = subMegaMenuId;

            const content = await Content.findOne({
                where: whereClause,
                include: [
                    {
                        model: Menu,
                        as: 'menu'
                    }
                ]
            });

            return Response.success(res, content, 'Content retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Create new content
    createContent: async (req, res, next) => {
        try {
            const { title, menuId, megaMenuId, subMegaMenuId, sections, sequence, isActive } = req.body;

            // Validate required fields
            if (!title || !sections) {
                return Response.error(res, 'Title and sections are required', 400);
            }

            // Create content with validated data
            const newContent = await Content.create({
                title,
                menuId: menuId || null,
                megaMenuId: megaMenuId || null,
                subMegaMenuId: subMegaMenuId || null,
                sections: sections,
                sequence: sequence || 0,
                isActive: isActive !== undefined ? isActive : true
            });

            const contentWithRelations = await Content.findByPk(newContent.id, {
                include: [
                    {
                        model: Menu,
                        as: 'menu'
                    },
                    {
                        model: MegaMenu,
                        as: 'megaMenu'
                    },
                    {
                        model: SubMegaMenu,
                        as: 'subMegaMenu'
                    }
                ]
            });

            return Response.success(res, contentWithRelations, 'Content created successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    // Update content
    updateContent: async (req, res, next) => {
        try {
            const content = await Content.findByPk(req.params.id);
            if (!content) {
                return Response.error(res, 'Content not found', 404);
            }
            await content.update(req.body);
            const updatedContent = await Content.findByPk(content.id, {
                include: [
                    {
                        model: Menu,
                        as: 'menu'
                    },
                    {
                        model: MegaMenu,
                        as: 'megaMenu'
                    }
                ]
            });
            return Response.success(res, updatedContent, 'Content updated successfully');
        } catch (error) {
            next(error);
        }
    },

    // Delete content
    deleteContent: async (req, res, next) => {
        try {
            const content = await Content.findByPk(req.params.id);
            if (!content) {
                return Response.error(res, 'Content not found', 404);
            }
            await content.destroy();
            return Response.success(res, null, 'Content deleted successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = contentController; 