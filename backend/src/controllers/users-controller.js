const admin = require('firebase-admin');
const logger = require('../config/logger-config');

const usersController = {
    async getAllUsers(req, res) {
        try {
            const db = admin.firestore();
            const usersSnapshot = await db.collection('users').get();
            
            const users = [];
            usersSnapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });

            res.status(200).json(users);
        } catch (error) {
            logger.error('Error getting users:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const db = admin.firestore();
            
            const userDoc = await db.collection('users').doc(id).get();
            if (!userDoc.exists) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ id: userDoc.id, ...userDoc.data() });
        } catch (error) {
            logger.error('Error getting user:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const db = admin.firestore();

            delete updateData.role;
            delete updateData.email;

            await db.collection('users').doc(id).update(updateData);
            
            res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            logger.error('Error updating user:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async createLibrarian(req, res) {
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
                role: 'librarian',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'active',
            });
    
            res.status(201).json({ message: 'Librarian created successfully' });
        } catch (error) {
            logger.error('Error creating librarian:', error);
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = usersController;