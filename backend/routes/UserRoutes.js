const express = require('express');
const UserController = require('../controllers/UserController');
const { authMiddleware } = require('../middlewares/Auth');

const router = express.Router();

//  routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Update user credentials
router.put('/update', authMiddleware, UserController.update);

// Delete user account
router.delete('/delete', authMiddleware, UserController.delete);

module.exports = router;