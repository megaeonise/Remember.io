const express = require('express');
const { registerController } = require('../controllers/userController');
const { loginController } = require('../controllers/userController');
const router = express.Router();

// For Registration -> Type is POST
router.post('/register',registerController);


// For Login -> Type is POST
router.post('/login',loginController);

module.exports = router;