const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-handler');

router.post('/register', authController.register);

router.get('/me', 
    authMiddleware, 
    authController.getCurrentUser
);

module.exports = router;