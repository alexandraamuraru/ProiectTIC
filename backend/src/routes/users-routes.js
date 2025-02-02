const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users-controller');
const authMiddleware = require('../middlewares/auth-handler');
const roleAuth = require('../middlewares/role-auth');

router.get('/', 
    authMiddleware, 
    roleAuth(['admin', 'librarian']), 
    usersController.getAllUsers
);

router.get('/:id', 
    authMiddleware, 
    roleAuth(['admin', 'librarian']), 
    usersController.getUserById
);

router.put('/:id', 
    authMiddleware, 
    roleAuth(['admin']), 
    usersController.updateUser
);

router.post('/librarian', 
    authMiddleware, 
    roleAuth(['admin']), 
    usersController.createLibrarian
);

module.exports = router;