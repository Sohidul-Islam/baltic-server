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

    static verifyToken(req, res, next) {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return Response.error(res, 'Invalid token', 401);
        }
    }
}

module.exports = AuthHelper; 