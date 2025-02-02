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

        const currentLoansCount = bookData.currentLoans ? bookData.currentLoans.length : 0;
        if (bookData.totalCopies <= currentLoansCount) {
          throw new Error('Book is not available');
        }

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
          status: 'active',
        };

        const bookUpdate = {
            totalCopies: admin.firestore.FieldValue.increment(-1),
          currentLoans: admin.firestore.FieldValue.arrayUnion({
            userId,
          }),
        };

        const userUpdate = {
          activeLoans: admin.firestore.FieldValue.arrayUnion({
            bookId,
          }),
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
        });

        transaction.update(bookRef, {
            totalCopies: admin.firestore.FieldValue.increment(1),
          currentLoans: admin.firestore.FieldValue.arrayRemove({
            userId: loanData.userData.userId,
          })
        });

        transaction.update(userRef, {
          activeLoans: admin.firestore.FieldValue.arrayRemove({
            bookId: loanData.bookData.bookId,
          })
        });
      });

      res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
      logger.error('Error returning book:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async getAllLoans(req, res) {
    const db = admin.firestore();

    try {
      const loansSnapshot = await db.collection('loans').get();
      const loans = [];
      loansSnapshot.forEach((doc) => {
        loans.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json({ loans });
    } catch (error) {
      logger.error('Error fetching loans:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = loansController;
