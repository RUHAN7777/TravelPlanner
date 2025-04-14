import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🧭 Travel Planner</div>
      <ul className="navbar-links">
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/add-trip">Add Trip</Link></li>
        <li><Link to="/dashboards">Manage Trip</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
