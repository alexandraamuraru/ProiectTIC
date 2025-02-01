const admin = require('firebase-admin');
const logger = require('../config/logger-config');

const authController = {
    async register(req, res) {
        try {
            const { email, password, fullName } = req.body;

            const userRecord = await admin.auth().createUser({
                email,
                password
            });

            const db = admin.firestore();
            await db.collection('users').doc(userRecord.uid).set({
                email,
                fullName,
                role: 'member',
                membershipDate: admin.firestore.FieldValue.serverTimestamp(),
                status: 'active',
                activeLoans: [],
                stats: {
                    totalBorrowed: 0,
                    currentlyBorrowed: 0,
                    overdueCount: 0
                }
            });

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            logger.error('Registration error:', error);
            res.status(400).json({ message: error.message });
        }
    },

    async login(req, res) {
        try {
            const { token } = req.body;
            
            const decodedToken = await admin.auth().verifyIdToken(token);
            
            const db = admin.firestore();
            const userDoc = await db.collection('users').doc(decodedToken.uid).get();
            
            if (!userDoc) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userData = userDoc.data();
            
            res.status(200).json({
                user: {
                    uid: decodedToken.uid,
                    email: decodedToken.email,
                    ...userData
                }
            });
        } catch (error) {
            logger.error('Login error:', error);
            res.status(401).json({ message: 'Authentication failed' });
        }
    },

    async getCurrentUser(req, res) {
        try {
            const db = admin.firestore();
            const userDoc = await db.collection('users').doc(req.user.uid).get();
            
            if (!userDoc.exists) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                user: {
                    uid: req.user.uid,
                    email: req.user.email,
                    ...userDoc.data()
                }
            });
        } catch (error) {
            logger.error('Get current user error:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;