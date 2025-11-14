const express = require('express');
const router = express.Router();
const { getStoreDashboard } = require('../controllers/storeController');
const authenticate = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
// Store owner routes
router.use(authenticate);
router.use(checkRole('store_owner'));
router.get('/dashboard', getStoreDashboard);
module.exports = router;