const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-handler');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', 
    authMiddleware, 
    authController.getCurrentUser
);

router.post('/verify-token', 
    authMiddleware, 
    (req, res) => res.status(200).json({ valid: true })
);

module.exports = router;