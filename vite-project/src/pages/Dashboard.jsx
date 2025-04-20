import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [analytics, setAnalytics] = useState({
    mostVisitedCities: [],
    mostPopularActivities: [],
  });
  const [destinationQuery, setDestinationQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) {
      alert('Please login first!');
      window.location.href = '/login';
      return;
    }

    fetchUserTrips();
    fetchAnalytics();
  }, []);

  const fetchUserTrips = async () => {
    try {
      const response = await axios.get('http://localhost:5000/trips', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(response.data);
    } catch (err) {
      console.error('Error fetching user trips:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [citiesRes, activitiesRes] = await Promise.all([
        axios.get('http://localhost:5000/analytics/most-visited-cities', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/analytics/most-popular-activities', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
  
      console.log('Cities:', citiesRes.data);
      console.log('Activities:', activitiesRes.data);
  
      setAnalytics({
        mostVisitedCities: citiesRes.data.mostVisitedCities || [],
        mostPopularActivities: activitiesRes.data.mostPopularActivities || [],
      });
      
  
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };
  
  

  const fetchByDestination = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/trips/destination/${destinationQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrips(res.data);
    } catch (err) {
      console.error('Error filtering by destination:', err);
    }
  };

  const fetchByDateRange = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/trips/dates/${startDate}/${endDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrips(res.data);
    } catch (err) {
      console.error('Error filtering by date range:', err);
    }
  };

  const updateActivityStatus = async (tripId, city, activityName, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/trips/${tripId}/update-activity`,
        { city, activityName, newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserTrips();
    } catch (err) {
      console.error('Error updating activity status:', err);
    }
  };

  const handleFileUpload = async (e, tripId) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axios.post(
        `http://localhost:5000/trips/${tripId}/upload-file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserTrips(); // Refresh trips to show newly uploaded file
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

  return (
    <div className="dashboard bg-slate-50 dark:bg-slate-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {user?.name && (
          <h2 className="text-2xl font-bold mb-2 text-slate-700 dark:text-slate-200">
            Welcome, <span className="text-primary">{user.name}</span> 👋
          </h2>
        )}
        <h1 className="text-3xl font-extrabold mb-8 gradient-text">Your Travel Dashboard</h1>
  
        {/* Filters */}
        <div className="filters bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 mb-8 flex flex-wrap gap-3 items-center">
          <div className="search-container flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search by Destination"
              value={destinationQuery}
              onChange={(e) => setDestinationQuery(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <button onClick={fetchByDestination} className="btn-primary">
            Search
          </button>
  
          <div className="date-filters flex flex-wrap gap-3 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
            <button onClick={fetchByDateRange} className="btn-secondary">
              Filter by Date
            </button>
          </div>
        </div>
  
        {/* Analytics */}
        <div className="analytics grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="analytics-card">
        <h3 className="card-title">Most Visited Cities</h3>
        <ul className="analytics-list">
          {analytics.mostVisitedCities.map((cityObj, idx) => (
            <li key={idx} className="analytics-item">
              <span className="city-name">{cityObj.city || 'Unknown'}</span>
              <span className="visit-count">Visited {cityObj.visits || 0} times</span>  {/* Use visits */}
            </li>
          ))}
        </ul>
      </div>

          <div className="analytics-card">
            <h3 className="card-title">Most Popular Activities</h3>
            <ul className="analytics-list">
              {analytics.mostPopularActivities.map((actObj, idx) => (
                <li key={idx} className="analytics-item">
                  <span className="activity-name">
                  {typeof actObj === 'string' ? actObj : actObj.activity || 'Unknown'}

                  </span>

                  {typeof actObj !== 'string' && (
                    <span className="activity-count">Chosen {actObj.count || 0} times</span>
                  )}

                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Trip Cards */}
        <div className="trips-container grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <div key={trip._id} className="trip-card">
              <h3 className="trip-title">{trip.tripName}</h3>
  
              {/* Destinations */}
              <div className="trip-section">
                <p className="section-label">Destinations</p>
                <div className="destinations-list">
                  {trip.destinations?.map((dest, index) => (
                    <span key={index} className="destination-tag">
                      {dest.city}, {dest.country}
                    </span>
                  ))}
                </div>
              </div>
  
              {/* Activities */}
              <div className="trip-section">
                <p className="section-label">Activities</p>
                <ul className="activities-list">
                  {trip.destinations?.map((dest, destIndex) =>
                    dest.activities?.map((act, actIndex) => (
                      <li key={`${destIndex}-${actIndex}`} className="activity-item">
                        <div className="activity-info">
                          <span className="activity-name">{act.name}</span>
                          <span className={`activity-status status-${act.status?.toLowerCase() || 'pending'}`}>
                            {act.status || 'Pending'}
                          </span>
                        </div>
                        <select
                          value={act.status || 'Pending'}
                          onChange={(e) =>
                            updateActivityStatus(
                              trip._id,
                              dest.city,
                              act.name,
                              e.target.value
                            )
                          }
                          className="status-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </li>
                    ))
                  )}
                </ul>
              </div>
  
              {/* Files */}
              {trip.files?.length > 0 && (
                <div className="trip-section">
                  <p className="section-label">Files</p>
                  <div className="files-list">
                    {trip.files.map((file, index) => (
                      <a
                        key={index}
                        href={`http://localhost:5000/trips/${trip._id}/files/${file.originalName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="file-link"
                      >
                        {file.originalName}
                      </a>
                    ))}
                  </div>
                </div>
              )}
  
              {/* Upload Files */}
              <div className="trip-section">
                <p className="section-label">Upload File</p>
                <div className="file-upload">
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, trip._id)}
                    accept="image/*,video/*,.pdf"
                    className="file-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
