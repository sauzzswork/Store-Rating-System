import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validation';
import './Auth.css';
const Login = () => {
const navigate = useNavigate();
const { login, user } = useAuth();
const [error, setError] = useState('');
// Redirect if already logged in
  React.useEffect(() => {
if (user) {
if (user.role === 'admin') navigate('/admin/dashboard');
else if (user.role === 'user') navigate('/user/stores');
else if (user.role === 'store_owner') navigate('/store/dashboard');
}
}, [user, navigate]);
const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
const result = await login(values.email, values.password);
if (result.success) {
const currentUser = JSON.parse(localStorage.getItem('user'));
if (currentUser.role === 'admin') navigate('/admin/dashboard');
else if (currentUser.role === 'user') navigate('/user/stores');
else if (currentUser.role === 'store_owner') navigate('/store/dashboard');
} else {
setError(result.message);
}
setSubmitting(false);
};
return (
<div>
<div>
<h2>Login to Store Rating System</h2>
  {error && <div>{error}</div>}
  <Formik
initialValues={{ email: '', password: '' }}
validationSchema={loginSchema}
    onSubmit={handleSubmit}
  >
    {({ isSubmitting }) => (
      <Form>
<div>
  <label htmlFor="email">Email</label>
  <Field
type="email"
name="email"
id="email"
    placeholder="Enter your email"
  />
  <ErrorMessage name="email" component="div" className="field-error" />
</div>
<div>
  <label htmlFor="password">Password</label>
  <Field
type="password"
name="password"
id="password"
    placeholder="Enter your password"
  />
  <ErrorMessage name="password" component="div" className="field-error" />
    </div>
    <button type="submit" disabled={isSubmitting} className="btn-primary">
      {isSubmitting ? 'Logging in...' : 'Login'}
    </button>
  </Form>
    )}
  </Formik>
  <p>
    Don't have an account? <Link to="/register">Register here</Link>
</p>
</div>
</div>
);
};
export default Login;