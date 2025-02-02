const admin = require('firebase-admin');
const logger = require('../config/logger-config');

const booksController = {
    async getAllBooks(req, res) {
        try {
            const db = admin.firestore();
            const booksSnapshot = await db.collection('books').get();
            
            const books = [];
            booksSnapshot.forEach(doc => {
                books.push({ id: doc.id, ...doc.data() });
            });

            res.status(200).json(books);
        } catch (error) {
            logger.error('Error getting books:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async getBookById(req, res) {
        try {
            const { id } = req.params;
            const db = admin.firestore();
            
            const bookDoc = await db.collection('books').doc(id).get();
            if (!bookDoc.exists) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.status(200).json({ id: bookDoc.id, ...bookDoc.data() });
        } catch (error) {
            logger.error('Error getting book:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async searchBooks(req, res) {
        try {
            const { query } = req.query;
            const db = admin.firestore();
            
            const booksRef = db.collection('books');
            const snapshot = await booksRef
                .where('title', '>=', query)
                .where('title', '<=', query + '\uf8ff')
                .get();

            const books = [];
            snapshot.forEach(doc => {
                books.push({ id: doc.id, ...doc.data() });
            });

            res.status(200).json(books);
        } catch (error) {
            logger.error('Error searching books:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async createBook(req, res) {
        try {
            const { 
                title, 
                author, 
                ISBN, 
                publisher,
                publishedYear, 
                totalCopies,
            } = req.body;
            const db = admin.firestore();
            const newBook = {
                title,
                author,
                ISBN,
                publisher,
                publishedYear,
                totalCopies,    
                currentLoans: [],
            };
            
            const bookRef = await db.collection('books').add(newBook);
            res.status(201).json({ id: bookRef.id, ...newBook });
        } catch (error) {
            logger.error('Error creating book:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async updateBook(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const db = admin.firestore();


            await db.collection('books').doc(id).update(updateData);
            
            res.status(200).json({ message: 'Book updated successfully' });
        } catch (error) {
            logger.error('Error updating book:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async deleteBook(req, res) {
        try {
            const { id } = req.params;
            const db = admin.firestore();

            const bookDoc = await db.collection('books').doc(id).get();
            if (bookDoc.data().currentLoans.length > 0) {
                return res.status(400).json({ 
                    message: 'Cannot delete book with active loans' 
                });
            }

            await db.collection('books').doc(id).delete();
            
            res.status(200).json({ message: 'Book deleted successfully' });
        } catch (error) {
            logger.error('Error deleting book:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async getBookLoans(req, res) {
        try {
            const { id } = req.params;
            const db = admin.firestore();
            
            const loansSnapshot = await db.collection('loans')
                .where('bookData.bookId', '==', id)
                .get();

            const loans = [];
            loansSnapshot.forEach(doc => {
                loans.push({ id: doc.id, ...doc.data() });
            });

            res.status(200).json(loans);
        } catch (error) {
            logger.error('Error getting book loans:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async getBooksByCategory(req, res) {
        try {
            const { category } = req.params;
            const db = admin.firestore();
            
            const booksSnapshot = await db.collection('books')
                .where('category.name', '==', category)
                .get();

            const books = [];
            booksSnapshot.forEach(doc => {
                books.push({ id: doc.id, ...doc.data() });
            });

            res.status(200).json(books);
        } catch (error) {
            logger.error('Error getting books by category:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = booksController;