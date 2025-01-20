const db = require('../db');
const { Content, Menu, MegaMenu } = db;
const Response = require('../helpers/Response.helper');

const contentController = {
    // Get all content
    getAllContent: async (req, res, next) => {
        try {
            const content = await Content.findAll({
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
            const menu = await Menu.findOne({
                where: { path: req.query.path },
                include: [{
                    model: Content,
                    as: 'contents',
                    include: [{
                        model: MegaMenu,
                        as: 'megaMenu'
                    }]
                }]
            });

            const megeMenu = await MegaMenu.findOne({
                where: { path: req.query.path },
                include: [{
                    model: Content,
                    as: 'contents',
                }]
            });

            if (!menu && !megeMenu) {
                return Response.error(res, 'Menu not found', 404);
            }


            return Response.success(res, (menu?.contents || megeMenu?.contents), 'Content retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Create new content
    createContent: async (req, res, next) => {
        try {
            const newContent = await Content.create(req.body);
            const contentWithRelations = await Content.findByPk(newContent.id, {
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