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
        // Save userId and user details
        localStorage.setItem('token', data.token);  // Save token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); // Optionally save full user data
        // Redirect to Add Trip or Dashboard
        window.location.href = '/add-trip'; // You can use React Router for navigation if you like
      } else {
        alert(data.message || 'Login failed!');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };
  

  return (
    <div className="register-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginUser;
