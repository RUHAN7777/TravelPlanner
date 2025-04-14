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

  // 👇 New: Extract user from localStorage
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
        axios.get('http://localhost:5000/analytics/most-visited-cities'),
        axios.get('http://localhost:5000/analytics/most-popular-activities'),
      ]);

      setAnalytics({
        mostVisitedCities: Array.isArray(citiesRes.data) ? citiesRes.data : [],
        mostPopularActivities: Array.isArray(activitiesRes.data) ? activitiesRes.data : [],
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchByDestination = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/trips/destination/${destinationQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(res.data);
    } catch (err) {
      console.error('Error filtering by destination:', err);
    }
  };

  const fetchByDateRange = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/trips/dates/${startDate}/${endDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      fetchUserTrips(); // Refresh trips after update
    } catch (err) {
      console.error('Error updating activity status:', err);
    }
  };

  return (
    <div className="dashboard">
      {/* 👇 New: Show welcome message */}
      {user?.name && <h2>Welcome, {user.name} 👋</h2>}

      <h1>Your Travel Dashboard</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by Destination"
          value={destinationQuery}
          onChange={(e) => setDestinationQuery(e.target.value)}
        />
        <button onClick={fetchByDestination}>Search</button>

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchByDateRange}>Filter by Date</button>
      </div>

      {/* Analytics */}
      <div className="analytics">
        <div>
          <h3>Most Visited Cities</h3>
          <ul>
            {analytics.mostVisitedCities.map((city, idx) => (
              <li key={idx}>{city}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Most Popular Activities</h3>
          <ul>
            {analytics.mostPopularActivities.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trip Cards */}
      <div className="trip-list">
        <h2>Your Trips</h2>
        {trips.length === 0 ? (
          <p>No trips found.</p>
        ) : (
          trips.map((trip) => (
            <div key={trip._id} className="trip-card">
              <h3>{trip.name}</h3>
              <p><strong>Destinations:</strong> {trip.destinations?.join(', ')}</p>

              <p><strong>Activities:</strong></p>
              <ul>
                {trip.activities?.map((act, index) => {
                  const activityName = typeof act === 'string' ? act : act.name;
                  const activityStatus = typeof act === 'string' ? 'Pending' : act.status || 'Pending';
                  return (
                    <li key={index}>
                      {activityName} - Status: {activityStatus}
                      <select
                        value={activityStatus}
                        onChange={(e) =>
                          updateActivityStatus(
                            trip._id,
                            trip.destinations[0],
                            activityName,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </li>
                  );
                })}
              </ul>

              {/* Files */}
              {trip.files?.length > 0 && (
                <div className="file-upload">
                  <h4>Files:</h4>
                  {trip.files.map((file, index) => (
                    <a
                      key={index}
                      href={`http://localhost:5000/trips/${trip._id}/files/${file.originalName}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {file.originalName}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
