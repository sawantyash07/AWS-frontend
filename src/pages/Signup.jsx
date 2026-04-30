import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Signup = ({ setFlash }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ label: '', color: '', width: '0%' });
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else {
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPasswordRegex.test(formData.password)) {
        newErrors.password = "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.";
      }
    }
    return newErrors;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });

    if (!password) {
      setPasswordStrength({ label: '', color: '', width: '0%' });
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (strongPasswordRegex.test(password)) {
      setPasswordStrength({ label: 'Strong', color: '#238636', width: '100%' }); // Green
    } else if (password.length >= 6) {
      setPasswordStrength({ label: 'Medium', color: '#58a6ff', width: '66%' }); // Blue
    } else {
      setPasswordStrength({ label: 'Weak', color: '#f85149', width: '33%' }); // Red
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      setFlash({ message: "Signup successful! Please login.", type: "success" });
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.errors ? err.response.data.errors[0].msg : (err.response?.data?.message || "Signup failed");
      setFlash({ message: errorMsg, type: "error" });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
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
              onChange={handlePasswordChange}
              className={errors.password ? 'error' : ''}
            />
            {passwordStrength.label && (
              <div className="strength-bar-container">
                <div 
                  className="strength-bar" 
                  style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }}
                ></div>
                <span className="strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <button type="submit" className="auth-btn">Sign up</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
