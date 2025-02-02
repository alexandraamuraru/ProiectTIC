const admin = require('firebase-admin');
const logger = require('../config/logger-config');

const authHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided'});
        }
        const db = admin.firestore();
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        
        req.user = decodedToken;
        req.user.details = userDoc.data();
        next();
    } catch (error) {
        logger.error('Authentication error: ', error);
        req.status(401).json({ message: 'Invalid token'});
    }
};

module.exports = authHandler;