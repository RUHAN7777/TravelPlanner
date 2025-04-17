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
    <div className="add-trip-container">
      <h1>Add a New Trip</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Trip Name</label>
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="Enter trip name"
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter country"
            required
          />
        </div>

        <div className="activities">
          <h3>Activities</h3>
          {activities.map((activity, index) => (
            <div key={index} className="activity-form">
              <input
                type="text"
                name="name"
                value={activity.name}
                onChange={(e) => handleActivityChange(index, e)}
                placeholder="Activity Name"
                required
              />
              <input
                type="text"
                name="type"
                value={activity.type}
                onChange={(e) => handleActivityChange(index, e)}
                placeholder="Activity Type"
                required
              />
              <select
                name="status"
                value={activity.status}
                onChange={(e) => handleActivityChange(index, e)}
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
              <button type="button" onClick={() => removeActivity(index)}>
                Remove Activity
              </button>
            </div>
          ))}
          <button type="button" onClick={addActivity} className="add-activity-btn">
            + Add Activity
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Add Trip
        </button>
      </form>
    </div>
  );
};

export default AddTrip;
