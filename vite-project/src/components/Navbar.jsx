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
    <nav className="modern-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">🧭</span>
          <span className="logo-text">Travel Planner</span>
        </div>
        <ul className="navbar-links">
          <li><Link to="/register" className="nav-link">Register</Link></li>
          <li><Link to="/login" className="nav-link">Login</Link></li>
          <li>
            <span onClick={() => handleNavigation('add-trip')} className="nav-link interactive">
              Add Trip
            </span>
          </li>
          <li>
            <span onClick={() => handleNavigation('dashboards')} className="nav-link interactive">
              Manage Trip
            </span>
          </li>
          {token && (
            <li>
              <span onClick={handleLogout} className="nav-link logout">
                Logout
              </span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
