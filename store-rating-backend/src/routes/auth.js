const express = require('express');
const router = express.Router();
const { register, login, updatePassword } = require('../controllers/authController');
const { validateUserInput } = require('../middleware/validation');
const authenticate = require('../middleware/auth');
router.post('/register', validateUserInput, register);
router.post('/login', login);
router.put('/update-password', authenticate, updatePassword);
module.exports = router;