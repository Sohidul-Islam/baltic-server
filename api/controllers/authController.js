const db = require('../db');
const { User } = db;
const Response = require('../helpers/Response.helper');
const AuthHelper = require('../helpers/Auth.helper');
const EmailHelper = require('../helpers/Email.helper');

const authController = {
    // Register new user
    register: async (req, res, next) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { username, email, password } = req.body;

            // Validate input
            if (!username || !email || !password) {
                await transaction.rollback();
                return Response.error(res, 'All fields are required', 400);
            }

            // Check if user exists
            const existingUser = await User.findOne({
                where: {
                    [db.Sequelize.Op.or]: [
                        { email },
                        { username }
                    ]
                }
            });

            if (existingUser) {
                await transaction.rollback();
                return Response.error(res, 'Email or username already exists', 400);
            }

            // Generate verification token
            const verificationToken = AuthHelper.generateVerificationToken();
            const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            // Create user
            const user = await User.create({
                username,
                email,
                password,
                verificationToken,
                verificationTokenExpiry
            }, { transaction });

            // Send verification email
            await EmailHelper.sendVerificationEmail(user.email, verificationToken);

            await transaction.commit();
            return Response.success(res, {
                message: 'Registration successful. Please check your email for verification.'
            }, 'User registered successfully', 201);
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    },

    // Verify email
    verifyEmail: async (req, res, next) => {
        try {
            const { email, token } = req.body;

            const user = await User.findOne({
                where: {
                    email,
                    verificationToken: token,
                    verificationTokenExpiry: {
                        [db.Sequelize.Op.gt]: new Date()
                    }
                }
            });

            if (!user) {
                return Response.error(res, 'Invalid or expired verification token', 400);
            }

            // Update user
            await user.update({
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiry: null
            });

            return Response.success(res, {
                message: 'Email verified successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    // Login
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return Response.error(res, 'Invalid credentials', 401);
            }

            // Check if email is verified
            if (!user.isVerified) {
                return Response.error(res, 'Please verify your email first', 401);
            }

            // Validate password
            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                return Response.error(res, 'Invalid credentials', 401);
            }

            // Generate token
            const token = AuthHelper.generateToken(user);

            return Response.success(res, {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Request password reset
    requestPasswordReset: async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return Response.error(res, 'If the email exists, a reset link will be sent', 200);
            }

            // Generate reset token
            const resetToken = AuthHelper.generateVerificationToken();
            const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

            await user.update({
                resetPasswordToken: resetToken,
                resetPasswordExpiry: resetTokenExpiry
            });

            // Send reset email
            await EmailHelper.sendPasswordResetEmail(email, resetToken);

            return Response.success(res, {
                message: 'If the email exists, a reset link will be sent'
            });
        } catch (error) {
            next(error);
        }
    },

    // Reset password
    resetPassword: async (req, res, next) => {
        try {
            const { email, token, newPassword } = req.body;

            const user = await User.findOne({
                where: {
                    email,
                    resetPasswordToken: token,
                    resetPasswordExpiry: {
                        [db.Sequelize.Op.gt]: new Date()
                    }
                }
            });

            if (!user) {
                return Response.error(res, 'Invalid or expired reset token', 400);
            }

            // Update password
            await user.update({
                password: newPassword,
                resetPasswordToken: null,
                resetPasswordExpiry: null
            });

            return Response.success(res, {
                message: 'Password reset successful'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController; 