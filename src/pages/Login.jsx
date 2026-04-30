import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = ({ setFlash }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Username or Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post('http://3.109.60.242:5000/api/auth/login', formData);
      login(res.data.token, res.data.user);
      setFlash({ message: "Login successful!", type: "success" });
      navigate('/dashboard');
    } catch (err) {
      setFlash({ message: err.response?.data?.message || "Login failed", type: "error" });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign in to VCS</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username or Email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <button type="submit" className="auth-btn">Sign in</button>
        </form>
        <p className="auth-footer">
          New user? <Link to="/signup">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
