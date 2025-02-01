const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books-controller');
const authMiddleware = require('../middlewares/auth-handler');
const roleAuth = require('../middlewares/role-auth');
const { validateBook } = require('../middlewares/validation');

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBookById);
router.get('/search', booksController.searchBooks);

router.post('/',
    authMiddleware,
    roleAuth(['admin', 'librarian']),
    validateBook,
    booksController.createBook
);

router.put('/:id',
    authMiddleware,
    roleAuth(['admin', 'librarian']),
    validateBook,
    booksController.updateBook
);

router.delete('/:id',
    authMiddleware,
    roleAuth(['admin']),
    booksController.deleteBook
);

router.get('/:id/loans',
    authMiddleware,
    roleAuth(['admin', 'librarian']),
    booksController.getBookLoans
);

router.get('/category/:category',
    booksController.getBooksByCategory
);

module.exports = router;