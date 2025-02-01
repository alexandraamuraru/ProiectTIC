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

router.put('/:id/role', 
    authMiddleware, 
    roleAuth(['admin']), 
    usersController.updateUserRole
);

module.exports = router;