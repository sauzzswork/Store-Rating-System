const pool = require('../config/database');
// Get Store Owner Dashboard
const getStoreDashboard = async (req, res) => {
try {
const userId = req.user.id;
// Get store owned by this user
const storeResult = await pool.query(
'SELECT id, name FROM stores WHERE user_id = $1',
[userId]
);
if (storeResult.rows.length === 0) {
return res.status(404).json({
success: false,
message: 'No store found for this user.'
});
}
const store = storeResult.rows[0];
// Get average rating
const avgRatingResult = await pool.query(
  'SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = $1',
  [store.id]
);
// Get ratings with user details
const ratingsResult = await pool.query(
`SELECT
r.id,
r.rating,
r.created_at,
u.name as user_name,
u.email as user_email
FROM ratings r
JOIN users u ON r.user_id = u.id
WHERE r.store_id = $1
ORDER BY r.created_at DESC`,
[store.id]
);
res.json({
success: true,
data: {
store: store.name,
averageRating: parseFloat(avgRatingResult.rows[0].average_rating).toFixed(2),
totalRatings: ratingsResult.rows.length,
ratings: ratingsResult.rows
}
});
} catch (error) {
console.error('Get store dashboard error:', error);
res.status(500).json({
success: false,
message: 'Error fetching store dashboard.'
});
}
};
module.exports = { getStoreDashboard };