const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthHelper {
    static generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static generateVerificationToken() {
        return crypto.randomInt(100000, 999999).toString();
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}

module.exports = AuthHelper; 