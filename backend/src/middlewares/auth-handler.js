const admin = require('firebase-admin');
const logger = require('../config/logger-config');

const authHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided'});
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        logger.error('Authentication error: ', error);
        req.status(401).json({ message: 'Invalid token'});
    }
};

module.exports = authHandler;