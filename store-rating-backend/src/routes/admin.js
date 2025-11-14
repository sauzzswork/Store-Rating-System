const express = require('express');
const router = express.Router();
const {
getDashboardStats,
getUsers,
createUser,
getStores,
createStore
} = require('../controllers/adminController');
const { validateUserInput, validateStoreInput } = require('../middleware/validation');
const authenticate = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
// All admin routes require authentication and admin role
router.use(authenticate);
router.use(checkRole('admin'));
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.post('/users', validateUserInput, createUser);
router.get('/stores', getStores);
router.post('/stores', validateStoreInput, createStore);
module.exports = router;