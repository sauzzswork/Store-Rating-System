import * as Yup from 'yup';
export const loginSchema = Yup.object({
email: Yup.string()
.email('Invalid email format')
.required('Email is required'),
password: Yup.string()
.required('Password is required'),
});
export const registerSchema = Yup.object({
name: Yup.string()
.min(1, 'Name must be at least 1 character')
.max(60, 'Name must not exceed 60 characters')
.required('Name is required'),
email: Yup.string()
.email('Invalid email format')
.required('Email is required'),
password: Yup.string()
.min(8, 'Password must be at least 8 characters')
.max(16, 'Password must not exceed 16 characters')
.matches(
/^(?=.*[A-Z])(?=.*[!@#$%^&amp;*])/,
'Password must contain at least one uppercase letter and one special character'
)
.required('Password is required'),
address: Yup.string()
.max(400, 'Address must not exceed 400 characters')
.required('Address is required'),
});
export const createUserSchema = Yup.object({
name: Yup.string()
.min(20, 'Name must be at least 20 characters')
.max(60, 'Name must not exceed 60 characters')
.required('Name is required'),
email: Yup.string()
.email('Invalid email format')
.required('Email is required'),
password: Yup.string()
.min(8, 'Password must be at least 8 characters')
.max(16, 'Password must not exceed 16 characters')
.matches(
/^(?=.*[A-Z])(?=.*[!@#$%^&amp;*])/,
'Password must contain at least one uppercase letter and one special character'
)
.required('Password is required'),
address: Yup.string()
.max(400, 'Address must not exceed 400 characters')
.required('Address is required'),
role: Yup.string()
.oneOf(['admin', 'user', 'store_owner'], 'Invalid role')
.required('Role is required'),
});
export const createStoreSchema = Yup.object({
name: Yup.string()
.min(20, 'Store name must be at least 20 characters')
.max(60, 'Store name must not exceed 60 characters')
.required('Store name is required'),
email: Yup.string()
.email('Invalid email format')
.required('Email is required'),
address: Yup.string()
.max(400, 'Address must not exceed 400 characters')
.required('Address is required'),
});
export const updatePasswordSchema = Yup.object({
currentPassword: Yup.string()
.required('Current password is required'),
newPassword: Yup.string()
.min(8, 'Password must be at least 8 characters')
.max(16, 'Password must not exceed 16 characters')
.matches(
/^(?=.*[A-Z])(?=.*[!@#$%^&amp;*])/,
'Password must contain at least one uppercase letter and one special character'
)
.required('New password is required'),
confirmPassword: Yup.string()
.oneOf([Yup.ref('newPassword')], 'Passwords must match')
.required('Confirm password is required'),
});
