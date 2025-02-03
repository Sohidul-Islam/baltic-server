const db = require('../db');
const { FooterContent } = db;
const Response = require('../helpers/Response.helper');

const footerContentController = {
    // Get active footer content
    getFooterContent: async (req, res, next) => {
        try {
            const footerContent = await FooterContent.findOne({
                where: { isActive: true },
                order: [['updatedAt', 'DESC']]
            });

            return Response.success(res, footerContent, 'Footer content retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Get all footer contents (for admin)
    getAllFooterContents: async (req, res, next) => {
        try {
            const footerContents = await FooterContent.findAll({
                order: [['updatedAt', 'DESC']]
            });

            return Response.success(res, footerContents, 'Footer contents retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Create new footer content
    createFooterContent: async (req, res, next) => {
        try {
            const { emails, phones, addresses } = req.body;

            // Validate required fields
            if (!emails || !phones || !addresses) {
                return Response.error(res, 'All fields are required', 400);
            }

            // Validate arrays
            if (!Array.isArray(emails) || !Array.isArray(phones) || !Array.isArray(addresses)) {
                return Response.error(res, 'Fields must be arrays', 400);
            }

            // Create footer content
            const footerContent = await FooterContent.create({
                emails,
                phones,
                addresses
            });

            // Deactivate other footer contents
            await FooterContent.update(
                { isActive: false },
                {
                    where: {
                        id: { [db.Sequelize.Op.ne]: footerContent.id }
                    }
                }
            );

            return Response.success(res, footerContent, 'Footer content created successfully', 201);
        } catch (error) {
            if (error.message.includes('Invalid email format')) {
                return Response.error(res, 'Invalid email format', 400);
            }
            next(error);
        }
    },

    // Update footer content
    updateFooterContent: async (req, res, next) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const { emails, phones, addresses, isActive } = req.body;

            const footerContent = await FooterContent.findByPk(id);
            if (!footerContent) {
                await transaction.rollback();
                return Response.error(res, 'Footer content not found', 404);
            }

            // Update footer content
            await footerContent.update({
                emails: emails || footerContent.emails,
                phones: phones || footerContent.phones,
                addresses: addresses || footerContent.addresses,
                isActive: isActive !== undefined ? isActive : footerContent.isActive
            }, { transaction });

            // If making this active, deactivate others
            if (isActive) {
                await FooterContent.update(
                    { isActive: false },
                    {
                        where: {
                            id: { [db.Sequelize.Op.ne]: id }
                        },
                        transaction
                    }
                );
            }

            await transaction.commit();
            return Response.success(res, footerContent, 'Footer content updated successfully');
        } catch (error) {
            await transaction.rollback();
            if (error.message.includes('Invalid email format')) {
                return Response.error(res, 'Invalid email format', 400);
            }
            next(error);
        }
    },

    // Delete footer content
    deleteFooterContent: async (req, res, next) => {
        try {
            const footerContent = await FooterContent.findByPk(req.params.id);
            if (!footerContent) {
                return Response.error(res, 'Footer content not found', 404);
            }

            await footerContent.destroy();
            return Response.success(res, null, 'Footer content deleted successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = footerContentController; 