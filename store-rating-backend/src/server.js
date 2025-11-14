const express = require('express');
const cors = require('cors');
require('dotenv').config();
// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const storeRoutes = require('./routes/store');
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);
// Health check
app.get('/api/health', (req, res) => {
res.json({ success: true, message: 'Server is running!' });
});
// Error handling middleware
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({
success: false,
message: 'Something went wrong!'
});
});
// 404 handler
app.use((req, res) => {
res.status(404).json({
success: false,
message: 'Route not found.'
});
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});