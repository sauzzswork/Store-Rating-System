import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
// Check if user is logged in on mount
const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');
if (token && userData) {
  try {
setUser(JSON.parse(userData));
} catch (error) {
console.error('Error parsing user data:', error);
logout();
}
}
setLoading(false);
}, []);
const login = async (email, password) => {
try {
const response = await api.post('/auth/login', { email, password });
const { token, user } = response.data;
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
setUser(user);
return { success: true };
} catch (error) {
return {
success: false,
message: error.response?.data?.message || 'Login failed',
};
}
};
const register = async (userData) => {
try {
const response = await api.post('/auth/register', userData);
const { token, user } = response.data;
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
setUser(user);
return { success: true };
} catch (error) {
return {
success: false,
message: error.response?.data?.message || 'Registration failed',
};
}
};
const logout = () => {
localStorage.removeItem('token');
localStorage.removeItem('user');
setUser(null);
};
const value = {
user,
login,
register,
logout,
loading,
};
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};
export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth must be used within AuthProvider');
}
return context;
};