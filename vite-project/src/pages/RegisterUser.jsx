import React, { useState } from 'react';
import '../styles/RegisterUser.css';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // You can replace this with your actual API endpoint
      const res = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userId', data._id);
        alert('User registered successfully!');
        setFormData({ name: '', email: '', password: '' });
      } else {
        alert(data.message || 'Registration failed!');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <h2 className="register-title">Create an Account</h2>
          <p className="register-subtitle">Join us today and start your travel planning journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>
  
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="form-input"
              placeholder="Enter your email address"
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
              placeholder="Create a strong password"
            />
          </div>
  
          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <span className="login-link">Login</span></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
