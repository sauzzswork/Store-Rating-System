const express = require('express');
const router = express.Router();
const { getStoresForUser, submitRating } = require('../controllers/userController');
const { validateRating } = require('../middleware/validation');
const authenticate = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
// All user routes require authentication and user role
router.use(authenticate);
router.use(checkRole('user'));
router.get('/stores', getStoresForUser);
router.post('/ratings', validateRating, submitRating);
module.exports = router;