const pool = require('../config/database');
// Get All Stores for User
const getStoresForUser = async (req, res) => {
try {
const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
const userId = req.user.id;
let query = `
SELECT
s.id,
s.name,
s.address,
COALESCE(AVG(r.rating), 0) as overall_rating,
ur.rating as user_rating
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
WHERE 1=1
`;
const params = [userId];
let paramIndex = 2;
// Apply filters
if (name) {
query += ` AND s.name ILIKE $${paramIndex}`;
params.push(`%${name}%`);
paramIndex++;
}
if (address) {
query += ` AND s.address ILIKE $${paramIndex}`;
params.push(`%${address}%`);
paramIndex++;
}
query += ' GROUP BY s.id, s.name, s.address, ur.rating';
// Apply sorting
const validSortColumns = ['name', 'address', 'overall_rating'];
const validSortOrders = ['ASC', 'DESC'];
if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
query += ` ORDER BY ${sortBy === 'overall_rating' ? 'overall_rating' : 's.' + sortBy} ${sortOrder}`;
} else {
query += ' ORDER BY s.name ASC';
}
const result = await pool.query(query, params);
const stores = result.rows.map(store => ({
...store,
overall_rating: parseFloat(store.overall_rating).toFixed(2),
user_rating: store.user_rating || null
}));
res.json({
success: true,
count: stores.length,
data: stores
});
} catch (error) {
console.error('Get stores for user error:', error);
res.status(500).json({
success: false,
message: 'Error fetching stores.'
});
}
};
// Submit or Update Rating
const submitRating = async (req, res) => {
try {
const { storeId, rating } = req.body;
const userId = req.user.id;
// Check if store exists
const storeExists = await pool.query(
'SELECT id FROM stores WHERE id = $1',
[storeId]
);
if (storeExists.rows.length === 0) {
return res.status(404).json({
success: false,
message: 'Store not found.'
});
}
// Check if rating already exists
const existingRating = await pool.query(
'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
[userId, storeId]
);
let result;
if (existingRating.rows.length > 0) {
  // Update existing rating
result = await pool.query(
`UPDATE ratings
SET rating = $1, updated_at = CURRENT_TIMESTAMP
WHERE user_id = $2 AND store_id = $3
RETURNING *`,
[rating, userId, storeId]
);
res.json({
success: true,
message: 'Rating updated successfully.',
data: result.rows[0]
});
} else {
// Insert new rating
result = await pool.query(
`INSERT INTO ratings (user_id, store_id, rating)
VALUES ($1, $2, $3)
RETURNING *`,
[userId, storeId, rating]
);
res.status(201).json({
success: true,
message: 'Rating submitted successfully.',
data: result.rows[0]
});
}
} catch (error) {
console.error('Submit rating error:', error);
res.status(500).json({
success: false,
message: 'Error submitting rating.'
});
}
};
module.exports = {
getStoresForUser,
submitRating
};