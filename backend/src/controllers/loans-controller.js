const admin = require('firebase-admin');
const logger = require('../config/logger-config');

const loansController = {
    async createLoan(req, res) {
        const db = admin.firestore();
        const { userId, bookId } = req.body;

        try {
            await db.runTransaction(async (transaction) => {
                const bookRef = db.collection('books').doc(bookId);
                const userRef = db.collection('users').doc(userId);
                
                const bookDoc = await transaction.get(bookRef);
                const userDoc = await transaction.get(userRef);
                
                if (!bookDoc.exists || !userDoc.exists) {
                    throw new Error('Book or user not found');
                }

                const bookData = bookDoc.data();
                const userData = userDoc.data();

                if (bookData.inventory.available <= 0) {
                    throw new Error('Book is not available');
                }

                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 14);

                const loanRef = db.collection('loans').doc();
                const newLoan = {
                    bookData: {
                        bookId,
                        title: bookData.title,
                        ISBN: bookData.ISBN
                    },
                    userData: {
                        userId,
                        name: userData.fullName
                    },
                    dates: {
                        borrowed: admin.firestore.FieldValue.serverTimestamp(),
                        due: dueDate,
                        returned: null
                    },
                    status: 'active',
                    extensions: [],
                    fines: {
                        amount: 0,
                        paid: false,
                        daysOverdue: 0
                    }
                };

                const bookUpdate = {
                    'inventory.available': admin.firestore.FieldValue.increment(-1),
                    currentLoans: admin.firestore.FieldValue.arrayUnion({
                        userId,
                        dueDate,
                        borrowDate: new Date()
                    }),
                    'stats.timesLoaned': admin.firestore.FieldValue.increment(1)
                };

                const userUpdate = {
                    activeLoans: admin.firestore.FieldValue.arrayUnion({
                        bookId,
                        dueDate,
                        borrowDate: new Date()
                    }),
                    'stats.totalBorrowed': admin.firestore.FieldValue.increment(1),
                    'stats.currentlyBorrowed': admin.firestore.FieldValue.increment(1)
                };

                transaction.set(loanRef, newLoan);
                transaction.update(bookRef, bookUpdate);
                transaction.update(userRef, userUpdate);
            });

            res.status(201).json({ message: 'Loan created successfully' });
        } catch (error) {
            logger.error('Error creating loan:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async returnBook(req, res) {
        const db = admin.firestore();
        const { loanId } = req.params;

        try {
            await db.runTransaction(async (transaction) => {
                const loanRef = db.collection('loans').doc(loanId);
                const loanDoc = await transaction.get(loanRef);

                if (!loanDoc.exists) {
                    throw new Error('Loan not found');
                }

                const loanData = loanDoc.data();
                if (loanData.status !== 'active') {
                    throw new Error('Loan is not active');
                }

                const bookRef = db.collection('books').doc(loanData.bookData.bookId);
                const userRef = db.collection('users').doc(loanData.userData.userId);

                transaction.update(loanRef, {
                    status: 'returned',
                    'dates.returned': admin.firestore.FieldValue.serverTimestamp()
                });

                transaction.update(bookRef, {
                    'inventory.available': admin.firestore.FieldValue.increment(1),
                    currentLoans: admin.firestore.FieldValue.arrayRemove({
                        userId: loanData.userData.userId,
                        dueDate: loanData.dates.due,
                        borrowDate: loanData.dates.borrowed
                    })
                });

                transaction.update(userRef, {
                    'stats.currentlyBorrowed': admin.firestore.FieldValue.increment(-1),
                    activeLoans: admin.firestore.FieldValue.arrayRemove({
                        bookId: loanData.bookData.bookId,
                        dueDate: loanData.dates.due,
                        borrowDate: loanData.dates.borrowed
                    })
                });
            });

            res.status(200).json({ message: 'Book returned successfully' });
        } catch (error) {
            logger.error('Error returning book:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = loansController;