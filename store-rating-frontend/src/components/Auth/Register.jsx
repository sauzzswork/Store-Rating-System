import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../../context/AuthContext';
import { registerSchema } from '../../utils/validation';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    const result = await register(values);
    if (result.success) {
      navigate('/user/stores');
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <div>
        <h2>Register New Account</h2>
        {error && <div>{error}</div>}
        <Formik
          initialValues={{ name: '', email: '', password: '', address: '' }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="name">Full Name (20-60 characters)</label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your full name"
                />
                <ErrorMessage name="name" component="div" className="field-error" />
              </div>
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
                <label htmlFor="password">Password (8-16 chars, 1 uppercase, 1 special char)</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="field-error" />
              </div>
              <div>
                <label htmlFor="address">Address (max 400 characters)</label>
                <Field
                  as="textarea"
                  name="address"
                  id="address"
                  rows="3"
                  placeholder="Enter your address"
                />
                <ErrorMessage name="address" component="div" className="field-error" />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;