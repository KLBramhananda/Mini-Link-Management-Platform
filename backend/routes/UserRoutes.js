const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Define routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.delete('/profile', UserController.deleteProfile);

module.exports = router;