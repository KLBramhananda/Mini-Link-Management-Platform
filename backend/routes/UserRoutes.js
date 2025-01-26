const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

//  routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

module.exports = router;