const nodemailer = require('nodemailer');

class EmailHelper {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD
            }
        });
    }

    async sendInquiryNotification(inquiry) {
        const adminEmail = {
            from: process.env.ADMIN_EMAIL,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL,
            subject: `New Inquiry: ${inquiry.inquiryType}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #004d99; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                        .info-item { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
                        .label { font-weight: bold; color: #004d99; }
                        .status { display: inline-block; padding: 5px 10px; border-radius: 3px; background: #e6f3ff; color: #004d99; }
                        .message-box { margin-top: 20px; padding: 15px; background: white; border-left: 4px solid #004d99; }
                        .footer { margin-top: 20px; text-align: center; color: #666; font-size: 0.9em; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>New Inquiry Received</h2>
                        </div>
                        <div class="content">
                            <div class="info-item">
                                <span class="label">Type:</span> ${inquiry.inquiryType}
                            </div>
                            <div class="info-item">
                                <span class="label">From:</span> ${inquiry.firstName} ${inquiry.lastName}
                            </div>
                            <div class="info-item">
                                <span class="label">Email:</span> ${inquiry.email}
                            </div>
                            <div class="info-item">
                                <span class="label">Company:</span> ${inquiry.companyName || 'N/A'}
                            </div>
                            <div class="info-item">
                                <span class="label">Job Title:</span> ${inquiry.jobTitle || 'N/A'}
                            </div>
                            <div class="info-item">
                                <span class="label">Phone:</span> ${inquiry.phone || 'N/A'}
                            </div>
                            <div class="info-item">
                                <span class="label">Status:</span> 
                                <span class="status">${inquiry.status}</span>
                            </div>
                            <div class="message-box">
                                <span class="label">Message:</span>
                                <p>${inquiry.message}</p>
                            </div>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from Baltic Inspection System</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const userEmail = {
            from: process.env.EMAIL,
            to: inquiry.email,
            subject: 'Thank you for your inquiry - Baltic Inspection',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #004d99; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                        .greeting { font-size: 1.1em; color: #004d99; margin-bottom: 20px; }
                        .message { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                        .inquiry-details { background: #e6f3ff; padding: 15px; border-radius: 5px; margin-top: 20px; }
                        .footer { margin-top: 20px; text-align: center; color: #666; font-size: 0.9em; }
                        .contact-info { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                        .social-links { margin-top: 20px; text-align: center; }
                        .social-links a { margin: 0 10px; color: #004d99; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Thank You for Contacting Us</h2>
                        </div>
                        <div class="content">
                            <div class="greeting">
                                <p>Dear ${inquiry.firstName},</p>
                            </div>
                            <div class="message">
                                <p>Thank you for reaching out to Baltic Inspection. We have received your inquiry and our team will review it shortly.</p>
                                <p>We typically respond to inquiries within 24-48 business hours.</p>
                            </div>
                            <div class="inquiry-details">
                                <h3>Your Inquiry Details:</h3>
                                <p><strong>Inquiry Type:</strong> ${inquiry.inquiryType}</p>
                                <p><strong>Message:</strong></p>
                                <p>${inquiry.message}</p>
                            </div>
                            <div class="contact-info">
                                <h3>Need Immediate Assistance?</h3>
                                <p>Contact us directly:</p>
                                <p>📞 Phone: +1234567890</p>
                                <p>📧 Email: support@balticinspection.com</p>
                            </div>
                            <div class="social-links">
                                <a href="#">Facebook</a> |
                                <a href="#">LinkedIn</a> |
                                <a href="#">Twitter</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Baltic Inspection. All rights reserved.</p>
                            <p>This is an automated message, please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            // Send email to admin
            await this.transporter.sendMail(adminEmail);

            // Send confirmation email to user
            await this.transporter.sendMail(userEmail);

            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    async sendStatusUpdateNotification(inquiry) {
        const userEmail = {
            from: process.env.ADMIN_EMAIL,
            to: inquiry.email,
            subject: `Your Inquiry Status Updated - Baltic Inspection`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #004d99; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                        .status-update { 
                            background: #e6f3ff; 
                            padding: 15px; 
                            border-radius: 5px; 
                            margin: 20px 0;
                            text-align: center;
                        }
                        .status-badge {
                            display: inline-block;
                            padding: 8px 15px;
                            border-radius: 20px;
                            background: #004d99;
                            color: white;
                            font-weight: bold;
                        }
                        .message { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                        .footer { margin-top: 20px; text-align: center; color: #666; font-size: 0.9em; }
                        .contact-info { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Inquiry Status Update</h2>
                        </div>
                        <div class="content">
                            <div class="greeting">
                                <p>Dear ${inquiry.firstName},</p>
                            </div>
                            <div class="status-update">
                                <p>Your inquiry has been updated to:</p>
                                <div class="status-badge">
                                    ${inquiry.status.toUpperCase()}
                                </div>
                            </div>
                            <div class="message">
                                <h3>Inquiry Details:</h3>
                                <p><strong>Type:</strong> ${inquiry.inquiryType}</p>
                                <p><strong>Original Message:</strong></p>
                                <p>${inquiry.message}</p>
                            </div>
                            <div class="contact-info">
                                <h3>Need Assistance?</h3>
                                <p>If you have any questions, please contact us:</p>
                                <p>📞 Phone: +1234567890</p>
                                <p>📧 Email: support@balticinspection.com</p>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Baltic Inspection. All rights reserved.</p>
                            <p>This is an automated message, please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await this.transporter.sendMail(userEmail);
            return true;
        } catch (error) {
            console.error('Status update email sending failed:', error);
            return false;
        }
    }

    async sendVerificationEmail(email, token) {
        const verificationEmail = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verify Your Email - Baltic Inspection',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #004d99; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                        .verification-code { text-align: center; margin-bottom: 20px; }
                        .verification-code h1 { font-size: 2em; color: #004d99; }
                        .footer { margin-top: 20px; text-align: center; color: #666; font-size: 0.9em; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Email Verification</h2>
                        </div>
                        <div class="content">
                            <p>Your verification code is:</p>
                            <div class="verification-link">
                                <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${email}">Verify Email</a>
                            </div>
                            <p>This link will expire in 24 hours.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await this.transporter.sendMail(verificationEmail);
            return true;
        } catch (error) {
            console.error('Verification email sending failed:', error);
            return false;
        }
    }

    async sendPasswordResetEmail(email, token) {
        const resetEmail = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset - Baltic Inspection',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #004d99; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                        .reset-code { text-align: center; margin-bottom: 20px; }
                        .reset-code h1 { font-size: 2em; color: #004d99; }
                        .footer { margin-top: 20px; text-align: center; color: #666; font-size: 0.9em; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Password Reset</h2>
                        </div>
                        <div class="content">
                            <p>Your password reset code is:</p>
                            <div class="reset-code">
                                <h1>${token}</h1>
                            </div>
                            <p>This code will expire in 1 hour.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await this.transporter.sendMail(resetEmail);
            return true;
        } catch (error) {
            console.error('Password reset email sending failed:', error);
            return false;
        }
    }
}

module.exports = new EmailHelper(); 