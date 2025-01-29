const admin = require('firebase-admin');
const logger = require('./logger-config');
const path = require('path');

const initializeFirebase = () => {
    try {
        const serviceAccount = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const db = admin.firestore();
        const auth = admin.auth();

        logger.info('Firebase Admin initialized successfully');
        return { db, auth };
    } catch (error) {
        logger.error('Error initializing Firebase Admin:', error);
        throw error;
    }
};

module.exports = { initializeFirebase };