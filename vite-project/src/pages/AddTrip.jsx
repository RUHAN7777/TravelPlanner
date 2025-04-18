// src/pages/AddTrip.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddTrip.css';

const AddTrip = () => {
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [activities, setActivities] = useState([{ name: '', type: '', status: '' }]);

  const handleActivityChange = (index, event) => {
    const newActivities = [...activities];
    newActivities[index][event.target.name] = event.target.value;
    setActivities(newActivities);
  };

  const addActivity = () => {
    setActivities([...activities, { name: '', type: '', status: '' }]);
  };

  const removeActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('You need to login first!');
      window.location.href = '/login';
      return;
    }
  
    const tripData = {
      tripName,
      startDate,
      endDate,
      destinations: [
        {
          city,
          country,
          arrivalDate: startDate,
          departureDate: endDate,
          activities,
        },
      ],
    };
  
    try {
      const response = await axios.post('http://localhost:5000/trips', tripData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert('Trip added successfully!');
      setTripName('');
      setStartDate('');
      setEndDate('');
      setCity('');
      setCountry('');
      setActivities([{ name: '', type: '', status: '' }]);
    } catch (error) {
      console.error('Error adding trip:', error);
      
      if (error.response) {
        // If the error contains a response (i.e., error from the server)
        console.error('Error response:', error.response.data);
        alert(`Failed to add trip: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else {
        // If there is no response (i.e., network error or client-side issue)
        alert(`Failed to add trip: ${error.message}`);
      }
    }
  };
  
  

  return (
    <div className="add-trip-page">
      <div className="add-trip-container">
        <div className="page-header">
          <h1 className="page-title">Create New Trip</h1>
          <p className="page-subtitle">Plan your next adventure with our AI-powered trip planner</p>
        </div>
        
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="section-title">Trip Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Trip Name</label>
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="Enter a memorable name for your trip"
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="form-row two-columns">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="form-row two-columns">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Where are you going?"
                    required
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Which country?"
                    required
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">Activities</h2>
                <p className="section-subtitle">What would you like to do on your trip?</p>
              </div>
              
              <div className="activities-list">
                {activities.map((activity, index) => (
                  <div key={index} className="activity-card">
                    <div className="activity-form">
                      <div className="form-row three-columns">
                        <div className="form-group">
                          <label>Activity Name</label>
                          <input
                            type="text"
                            name="name"
                            value={activity.name}
                            onChange={(e) => handleActivityChange(index, e)}
                            placeholder="e.g., Visit Eiffel Tower"
                            required
                            className="input-field"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Activity Type</label>
                          <input
                            type="text"
                            name="type"
                            value={activity.type}
                            onChange={(e) => handleActivityChange(index, e)}
                            placeholder="e.g., Sightseeing"
                            required
                            className="input-field"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Status</label>
                          <select
                            name="status"
                            value={activity.status}
                            onChange={(e) => handleActivityChange(index, e)}
                            required
                            className="select-field"
                          >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                          </select>
                        </div>
                      </div>
                      
                      <button 
                        type="button" 
                        onClick={() => removeActivity(index)}
                        className="remove-activity-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                type="button" 
                onClick={addActivity} 
                className="add-activity-btn"
              >
                <span className="btn-icon">+</span> Add Activity
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Create Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTrip;
