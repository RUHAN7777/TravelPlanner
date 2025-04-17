import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleNavigation = (page) => {
    if (token) {
      navigate(`/${page}`);
    } else {
      localStorage.setItem('redirectPage', page);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('redirectPage');
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🧭 Travel Planner</div>
      <ul className="navbar-links">
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><span onClick={() => handleNavigation('add-trip')}>Add Trip</span></li>
        <li><span onClick={() => handleNavigation('dashboards')}>Manage Trip</span></li>
        {token && <li><span onClick={handleLogout}>Logout</span></li>}
      </ul>
    </nav>
  );
};

export default Navbar;
