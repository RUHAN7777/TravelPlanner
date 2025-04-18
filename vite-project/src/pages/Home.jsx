import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Home.css';
import beach from '../assets/beach.jpg';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: '📌',
      title: 'Trip Management',
      description: 'Create and manage trips with destinations and activities tailored to your preferences.',
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600'
    },
    {
      icon: '🗓️',
      title: 'Smart Filtering',
      description: 'Filter trips by destination, date range, budget, or travel style.',
      color: 'bg-gradient-to-r from-blue-500 to-teal-400'
    },
    {
      icon: '📸',
      title: 'Media Gallery',
      description: 'Upload and organize trip-related photos, videos and documents in one place.',
      color: 'bg-gradient-to-r from-pink-500 to-orange-400'
    },
    {
      icon: '📊',
      title: 'Travel Analytics',
      description: 'Gain insights on your travel patterns, most visited places and favorite activities.',
      color: 'bg-gradient-to-r from-emerald-500 to-lime-500'
    }
  ];

  return (
    <div className={`app-container ${isLoaded ? 'loaded' : ''}`}>
      <Navbar />
      
      {/* Hero Section - Full Height with Parallax */}
      <section className="hero-section">
        <div className="hero-parallax"></div>
        <div className="hero-content-wrapper">
          <div className={`hero-content ${isLoaded ? 'slide-up' : ''}`}>
            <h1 className="hero-title">
              <span className="accent">AI-Powered</span> Trip Planner
            </h1>
            <p className="hero-subtitle">
              Craft personalized travel experiences with the help of artificial intelligence.
              Your dream vacation is just a few clicks away.
            </p>
            <div className="hero-buttons">
              <button className="primary-button">Plan Your Trip</button>
              <button className="secondary-button">Explore Features</button>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Glass Card Feature Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">Intelligent Travel Features</h2>
          <p className="section-subtitle">
            Our AI analyzes thousands of travel options to create your perfect itinerary
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                key={index}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className={`feature-icon-wrapper ${feature.color}`}>
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="recommendation-section">
        <div className="recommendation-content">
          <div className="recommendation-text">
            <h2 className="section-title">AI Travel Recommendations</h2>
            <p className="recommendation-description">
              Our advanced algorithms analyze your preferences, budget, and travel style to suggest
              destinations and activities perfectly matched to you.
            </p>
            <ul className="recommendation-list">
              <li>Personalized itineraries based on your interests</li>
              <li>Budget-optimized travel plans</li>
              <li>Off-the-beaten-path suggestions</li>
              <li>Weather-aware scheduling</li>
            </ul>
            <button className="cta-button">Try AI Planner</button>
          </div>
          <div className="recommendation-image">
            <div className="map-visualization"><img src={beach} alt="Beach" className="map-image" /></div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Travelers Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "This AI planner helped me discover hidden gems I would have never found on my own. 
              My trip to Barcelona was unforgettable!"
            </p>
            <div className="testimonial-author">Sarah M.</div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "I was able to plan a 2-week Europe trip in under 30 minutes. The AI 
              suggestions were spot on with my travel style."
            </p>
            <div className="testimonial-author">David L.</div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "The budget optimization feature saved me over $500 on my last vacation while 
              still hitting all the major attractions."
            </p>
            <div className="testimonial-author">Aisha T.</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready for your next adventure?</h2>
          <p className="cta-description">
            Join thousands of travelers who have discovered their perfect trip with our AI planner
          </p>
          <button className="main-cta-button">Start Planning Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">AI Trip Planner</div>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/features">Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/support">Support</a>
          </div>
          <div className="footer-social">
            <a href="#" className="social-icon">📱</a>
            <a href="#" className="social-icon">💬</a>
            <a href="#" className="social-icon">📸</a>
            <a href="#" className="social-icon">🐦</a>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} AI Trip Planner. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;