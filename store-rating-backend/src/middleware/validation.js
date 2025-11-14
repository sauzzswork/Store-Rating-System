const validateUserInput = (req, res, next) => {
const { name, email, password, address } = req.body;
const errors = [];
// Name validation (20-60 characters)

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email || !emailRegex.test(email)) {
errors.push('Valid email is required.');
}
// Password validation (8-16 chars, 1 uppercase, 1 special char)
if (password) {
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/
if (!passwordRegex.test(password)) {
  errors.push('Password must be 8-16 characters with at least one uppercase letter and one special character.');
}
}
// Address validation (max 400 characters)
if (!address || address.length > 400) {
errors.push('Address is required and must not exceed 400 characters.');
}
if (errors.length > 0) {
return res.status(400).json({ success: false, errors });
}
next();
};
const validateStoreInput = (req, res, next) => {
const { name, email, address } = req.body;
const errors = [];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email || !emailRegex.test(email)) {
errors.push('Valid email is required.');
}
if (!address || address.length > 400) {
errors.push('Address is required and must not exceed 400 characters.');
}
if (errors.length > 0) {
return res.status(400).json({ success: false, errors });
}
next();
};
const validateRating = (req, res, next) => {
const { rating } = req.body;
if (!rating || rating < 1 || rating > 5) {
return res.status(400).json({
success: false,
message: 'Rating must be between 1 and 5.'
});
}
next();
};
module.exports = {
validateUserInput,
validateStoreInput,
validateRating
};