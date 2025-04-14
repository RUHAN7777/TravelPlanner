import React from 'react';
import Navbar from '../components/Navbar'; // ✅ Add this
import heroImage from '../assets/rome-city.jpg'; // Adjust the path if needed
import '../styles/Home.css'; // Assuming you already have styles for home

const Home = () => {
  return (
    <>
      <Navbar /> {/* ✅ Navbar added here */}
      <div className="home-container">
        {/* Hero Section */}
        <section className="home-hero" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-content">
            <h1 className="hero-title">🌍 Travel Itinerary Planner</h1>
            <p className="hero-subtitle">Your one-stop platform to organize trips, track activities, and manage travel memories.</p>
            <a href="/dashboards" className="explore-btn">Explore Trips</a>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2 className="section-title">✨ Features</h2>
          <ul className="features-list">
            <li>📌 Create and manage trips with destinations and activities</li>
            <li>🗓️ Filter trips by destination or date range</li>
            <li>📸 Upload and view trip-related files (images, videos, documents)</li>
            <li>📊 View analytics on most visited places and popular activities</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Home;
