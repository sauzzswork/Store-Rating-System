const bcrypt = require('bcrypt');
const pool = require('../config/database');
// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
try {
const usersCount = await pool.query('SELECT COUNT(*) FROM users WHERE role != \'admin\'');
const storesCount = await pool.query('SELECT COUNT(*) FROM stores');
const ratingsCount = await pool.query('SELECT COUNT(*) FROM ratings');
res.json({
success: true,
data: {
totalUsers: parseInt(usersCount.rows[0].count),
totalStores: parseInt(storesCount.rows[0].count),
totalRatings: parseInt(ratingsCount.rows[0].count)
}
});
} catch (error) {
console.error('Dashboard stats error:', error);
res.status(500).json({
success: false,
message: 'Error fetching dashboard statistics.'
});
}
};
// Get All Users with Filtering and Sorting
const getUsers = async (req, res) => {
try {
const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
const params = [];
let paramIndex = 1;
// Apply filters
if (name) {
query += ` AND name ILIKE $${paramIndex}`;
params.push(`%${name}%`);
paramIndex++;
}
if (email) {
query += ` AND email ILIKE $${paramIndex}`;
params.push(`%${email}%`);
paramIndex++;
}
if (address) {
query += ` AND address ILIKE $${paramIndex}`;
params.push(`%${address}%`);
paramIndex++;
}
if (role) {
query += ` AND role = $${paramIndex}`;
params.push(role);
paramIndex++;
}
// Apply sorting
const validSortColumns = ['name', 'email', 'address', 'role', 'created_at'];
const validSortOrders = ['ASC', 'DESC'];
if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
} else {
query += ' ORDER BY name ASC';
}
const result = await pool.query(query, params);
res.json({
success: true,
count: result.rows.length,
data: result.rows
});
} catch (error) {
console.error('Get users error:', error);
res.status(500).json({
success: false,
message: 'Error fetching users.'
});
}
};
// Create New User (Admin or Store Owner)
const createUser = async (req, res) => {
try {
const { name, email, password, address, role } = req.body;
// Validate role
if (!['admin', 'store_owner', 'user'].includes(role)) {
return res.status(400).json({
success: false,
message: 'Invalid role specified.'
});
}
// Check if user exists
const existingUser = await pool.query(
'SELECT id FROM users WHERE email = $1',
[email]
);
if (existingUser.rows.length > 0) {
  return res.status(400).json({
success: false,
message: 'User with this email already exists.'
});
}
// Hash password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
// Insert user
const result = await pool.query(
`INSERT INTO users (name, email, password, address, role)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, name, email, address, role`,
[name, email, hashedPassword, address, role]
);
res.status(201).json({
success: true,
message: 'User created successfully.',
data: result.rows[0]
});
} catch (error) {
console.error('Create user error:', error);
res.status(500).json({
success: false,
message: 'Error creating user.'
});
}
};
// Get All Stores with Filtering and Sorting
const getStores = async (req, res) => {
try {
const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
let query = `
SELECT
s.id,
s.name,
s.email,
s.address,
COALESCE(AVG(r.rating), 0) as rating
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
WHERE 1=1
`;
const params = [];
let paramIndex = 1;
// Apply filters
if (name) {
query += ` AND s.name ILIKE $${paramIndex}`;
params.push(`%${name}%`);
paramIndex++;
}
if (email) {
query += ` AND s.email ILIKE $${paramIndex}`;
params.push(`%${email}%`);
paramIndex++;
}
if (address) {
query += ` AND s.address ILIKE $${paramIndex}`;
params.push(`%${address}%`);
paramIndex++;
}
query += ' GROUP BY s.id, s.name, s.email, s.address';
// Apply sorting
const validSortColumns = ['name', 'email', 'address', 'rating'];
const validSortOrders = ['ASC', 'DESC'];
if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
query += ` ORDER BY ${sortBy === 'rating' ? 'rating' : 's.' + sortBy} ${sortOrder.toUpperCase()}`;
} else {
query += ' ORDER BY s.name ASC';
}
const result = await pool.query(query, params);
// Round ratings to 2 decimal places
const stores = result.rows.map(store => ({
...store,
rating: parseFloat(store.rating).toFixed(2)
}));
res.json({
success: true,
count: stores.length,
data: stores
});
} catch (error) {
console.error('Get stores error:', error);
res.status(500).json({
success: false,
message: 'Error fetching stores.'
});
}
};
// Create New Store
const createStore = async (req, res) => {
try {
const { name, email, address, storeOwnerId } = req.body;
// Check if store email exists
const existingStore = await pool.query(
'SELECT id FROM stores WHERE email = $1',
[email]
);
if (existingStore.rows.length > 0) {
  return res.status(400).json({
success: false,
message: 'Store with this email already exists.'
});
}
// Verify store owner exists
if (storeOwnerId) {
const owner = await pool.query(
'SELECT id FROM users WHERE id = $1 AND role = \'store_owner\'',
[storeOwnerId]
);
if (owner.rows.length === 0) {
return res.status(400).json({
success: false,
message: 'Invalid store owner ID.'
});
}
}
// Insert store
const result = await pool.query(
`INSERT INTO stores (name, email, address, user_id)
VALUES ($1, $2, $3, $4)
RETURNING id, name, email, address, user_id`,
[name, email, address, storeOwnerId || null]
);
res.status(201).json({
success: true,
message: 'Store created successfully.',
data: result.rows[0]
});
} catch (error) {
console.error('Create store error:', error);
res.status(500).json({
success: false,
message: 'Error creating store.'
});
}
};
module.exports = {
getDashboardStats,
getUsers,
createUser,
getStores,
createStore
};
