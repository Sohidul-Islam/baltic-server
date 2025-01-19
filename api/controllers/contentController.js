const { Content, Menu, MegaMenu } = require('../models');

const contentController = {
    // Get all content
    getAllContent: async (req, res) => {
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
            res.json(content);
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Get content by menu path
    getContentByMenuPath: async (req, res) => {
        try {
            const menu = await Menu.findOne({
                where: { path: req.params.path },
                include: [{
                    model: Content,
                    as: 'contents',
                    include: [{
                        model: MegaMenu,
                        as: 'megaMenu'
                    }]
                }]
            });
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            res.json(menu.contents);
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Create new content
    createContent: async (req, res) => {
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
            res.status(201).json(contentWithRelations);
        } catch (error) {
            console.error('Error creating content:', error);
            res.status(400).json({ message: error.message });
        }
    },

    // Update content
    updateContent: async (req, res) => {
        try {
            const content = await Content.findByPk(req.params.id);
            if (!content) {
                return res.status(404).json({ message: 'Content not found' });
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
            res.json(updatedContent);
        } catch (error) {
            console.error('Error updating content:', error);
            res.status(400).json({ message: error.message });
        }
    },

    // Delete content
    deleteContent: async (req, res) => {
        try {
            const content = await Content.findByPk(req.params.id);
            if (!content) {
                return res.status(404).json({ message: 'Content not found' });
            }
            await content.destroy();
            res.json({ message: 'Content deleted successfully' });
        } catch (error) {
            console.error('Error deleting content:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = contentController; 