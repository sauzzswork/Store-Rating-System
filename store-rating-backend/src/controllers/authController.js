const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt');
// User Registration
const register = async (req, res) => {
try {
const { name, email, password, address } = req.body;
// Check if user already exists
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
// Insert new user
const result = await pool.query(
`INSERT INTO users (name, email, password, address, role)
VALUES ($1, $2, $3, $4, 'user')
RETURNING id, name, email, address, role`,
[name, email, hashedPassword, address]
);
const user = result.rows[0];
const token = generateToken(user.id, user.role);
res.status(201).json({
success: true,
message: 'User registered successfully.',
token,
user: {
id: user.id,
name: user.name,
email: user.email,
address: user.address,
role: user.role
}
});
} catch (error) {
console.error('Registration error:', error);
res.status(500).json({
success: false,
message: 'Server error during registration.'
});
}
};
// User Login
const login = async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) {
return res.status(400).json({
success: false,
message: 'Email and password are required.'
});
}
// Find user
const result = await pool.query(
'SELECT * FROM users WHERE email = $1',
[email]
);
if (result.rows.length === 0) {
return res.status(401).json({
success: false,
message: 'Invalid email or password.'
});
}
const user = result.rows[0];
// Verify password
const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
return res.status(401).json({
success: false,
message: 'Invalid email or password.'
});
}
const token = generateToken(user.id, user.role);
res.json({
success: true,
message: 'Login successful.',
token,
user: {
id: user.id,
name: user.name,
email: user.email,
address: user.address,
role: user.role
}
});
} catch (error) {
console.error('Login error:', error);
res.status(500).json({
success: false,
message: 'Server error during login.'
});
}
};
// Update Password
const updatePassword = async (req, res) => {
try {
const { currentPassword, newPassword } = req.body;
const userId = req.user.id;
// Validate new password
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/
if (!passwordRegex.test(newPassword)) {
  return res.status(400).json({
    success: false,
    message: 'New password must be 8-16 characters with at least one uppercase letter and one special character.'
  });
}
// Get current user
const result = await pool.query(
'SELECT password FROM users WHERE id = $1',
[userId]
);
if (result.rows.length === 0) {
return res.status(404).json({
success: false,
message: 'User not found.'
});
}
// Verify current password
const isPasswordValid = await bcrypt.compare(currentPassword, result.rows[0].password);
if (!isPasswordValid) {
return res.status(401).json({
success: false,
message: 'Current password is incorrect.'
});
}
// Hash new password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
// Update password
await pool.query(
'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
[hashedPassword, userId]
);
res.json({
success: true,
message: 'Password updated successfully.'
});
} catch (error) {
console.error('Update password error:', error);
res.status(500).json({
success: false,
message: 'Server error during password update.'
});
}
};
module.exports = { register, login, updatePassword };