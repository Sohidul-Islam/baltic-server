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
                message: 'Registration successful. Please check your email for verification.',
                user: user
            }, 'User registered successfully', 200);
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    },

    getAllUsers: async (req, res, next) => {
        const users = await User.findAll();
        return Response.success(res, {
            users: users
        }, 'Users fetched successfully', 200);
    },
    verifyUser: async (req, res, next) => {
        const { id } = req.user;
        const user = await User.findByPk(id);
        await user.update({ isVerified: true });
        return Response.success(res, {
            user: user
        }, 'User verified successfully', 200);
    },

    updateUserStatus: async (req, res, next) => {
        const { id } = req.params;
        const { status } = req.body;
        const user = await User.findByPk(id);
        await user.update({ status });
        return Response.success(res, {
            user: user
        }, 'User status updated successfully', 200);
    },
    updateUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { username, email, password } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return Response.error(res, 'User not found', 404);
            }

            // Password will be automatically hashed by the model hooks
            await user.update({
                username: username || user.username,
                email: email || user.email,
                password: password || user.password
            });

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return Response.success(res, {
                user: userResponse
            }, 'User updated successfully', 200);
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async (req, res, next) => {
        const { id } = req.params;
        const user = await User.findByPk(id);
        await user.destroy();
        return Response.success(res, {
            message: 'User deleted successfully'
        }, 'User deleted successfully', 200);
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

    resendVerificationEmail: async (req, res, next) => {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return Response.error(res, 'User not found', 404);
        }

        if (user?.dataValues?.isVerified) {
            return Response.error(res, 'Email already verified', 400);
        }

        const verificationToken = AuthHelper.generateVerificationToken();
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours 

        await user.update({
            verificationToken,
            verificationTokenExpiry
        });
        await EmailHelper.sendVerificationEmail(user.email, verificationToken);
        return Response.success(res, {
            message: 'Verification email resent'
        });
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

            // Validate password using the instance method
            const isValidPassword = await user.validatePassword(password, user.dataValues?.password);

            console.log({ isValidPassword });
            if (!isValidPassword) {
                return Response.error(res, 'Invalid credentials', 401);
            }

            // Generate token
            const token = AuthHelper.generateToken(user);

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return Response.success(res, {
                token,
                user: userResponse
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
            const { email, token, password } = req.body;

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

            // Password will be automatically hashed by the model hooks
            await user.update({
                password: password,
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