const db = require('../db');
const { Inquiry } = db;
const Response = require('../helpers/Response.helper');
const EmailHelper = require('../helpers/Email.helper');

const inquiryController = {
    // Get all inquiries
    getAllInquiries: async (req, res, next) => {
        try {
            const inquiries = await Inquiry.findAll({
                order: [['createdAt', 'DESC']]
            });
            return Response.success(res, inquiries, 'Inquiries retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Get single inquiry
    getInquiry: async (req, res, next) => {
        try {
            const inquiry = await Inquiry.findByPk(req.params.id);
            if (!inquiry) {
                return Response.error(res, 'Inquiry not found', 404);
            }
            return Response.success(res, inquiry, 'Inquiry retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    // Create new inquiry
    createInquiry: async (req, res, next) => {
        try {
            const {
                inquiryType,
                firstName,
                lastName,
                email,
                companyName,
                jobTitle,
                phone,
                message,
                agreeToTerms
            } = req.body;

            // Validate required fields
            if (!inquiryType || !firstName || !lastName || !email || !message || !agreeToTerms) {
                return Response.error(res, 'Please fill all required fields', 400);
            }

            // Create inquiry
            const inquiry = await Inquiry.create({
                inquiryType,
                firstName,
                lastName,
                email,
                companyName,
                jobTitle,
                phone,
                message,
                agreeToTerms
            });

            // Send email notifications
            await EmailHelper.sendInquiryNotification(inquiry);

            return Response.success(res, inquiry, 'Inquiry submitted successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    // Update inquiry status
    updateInquiryStatus: async (req, res, next) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { status } = req.body;
            const inquiry = await Inquiry.findByPk(req.params.id);

            if (!inquiry) {
                await transaction.rollback();
                return Response.error(res, 'Inquiry not found', 404);
            }

            // Update status
            await inquiry.update({ status }, { transaction });

            // Send status update email
            await EmailHelper.sendStatusUpdateNotification(inquiry);

            await transaction.commit();
            return Response.success(res, inquiry, 'Inquiry status updated and notification sent successfully');
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    },

    // Delete inquiry
    deleteInquiry: async (req, res, next) => {
        try {
            const inquiry = await Inquiry.findByPk(req.params.id);
            if (!inquiry) {
                return Response.error(res, 'Inquiry not found', 404);
            }
            await inquiry.destroy();
            return Response.success(res, null, 'Inquiry deleted successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = inquiryController; 