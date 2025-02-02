const express = require('express');
const router = express.Router();
const loansController = require('../controllers/loans-controller');
const authMiddleware = require('../middlewares/auth-handler');
const roleAuth = require('../middlewares/role-auth');

router.post('/', 
    authMiddleware, 
    roleAuth(['member']), 
    loansController.createLoan
);

router.put('/:loanId/return', 
    authMiddleware, 
    roleAuth(['admin', 'librarian']), 
    loansController.returnBook
);

router.get('/',
    authMiddleware,
    loansController.getAllLoans
)

module.exports = router;