import React, { useState } from 'react';
import '../styles/LoginUser.css'; // Reusing the same light blue style

const LoginUser = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(`Welcome back, ${data.user.name}!`);
        localStorage.setItem('token', data.token);  // Save token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); // Optionally save full user data

        // Redirect to the appropriate page after login
        const redirectPage = localStorage.getItem('redirectPage') || 'add-trip'; // Default to 'add-trip' if not set
        localStorage.removeItem('redirectPage');  // Clear the redirectPage after use
        window.location.href = `/${redirectPage}`;  // Redirect to the intended page
      } else {
        alert(data.message || 'Login failed!');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Please enter your details to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
  
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
  
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <span className="register-link">Register</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
