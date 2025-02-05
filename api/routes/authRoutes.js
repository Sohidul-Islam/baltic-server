const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const AuthHelper = require('../helpers/Auth.helper');

// Authentication routes
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-verification-email', authController.resendVerificationEmail);
router.get('/users/all', authController.getAllUsers);
router.get('/verify-token', AuthHelper.verifyToken, authController.verifyUser);
router.post('/users/:id/update-status', authController.updateUserStatus);
router.post('/users/:id/update', authController.updateUser);
router.post('/users/:id/delete', authController.deleteUser);

module.exports = router; 