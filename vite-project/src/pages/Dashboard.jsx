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
  
      console.log(citiesRes.data, activitiesRes.data);
  
      // 👇 Actually set the data here
      setAnalytics({
        mostVisitedCities: Array.isArray(citiesRes.data.mostVisitedCities)
          ? citiesRes.data.mostVisitedCities
          : [],
        mostPopularActivities: Array.isArray(activitiesRes.data.mostPopularActivities)
          ? activitiesRes.data.mostPopularActivities
          : [],
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
    <div className="dashboard">
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
        {analytics.mostVisitedCities.map((cityObj, idx) => (
          <li key={idx}>
            {cityObj._id} - Visited {cityObj.visitCount} times
          </li>
        ))}
      </ul>

        </div>
        <div>
          <h3>Most Popular Activities</h3>
          <ul>
          {analytics.mostPopularActivities.map((actObj, idx) => (
            <li key={idx}>
              {typeof actObj === 'string' ? actObj : `${actObj._id} - Chosen ${actObj.count} times`}
            </li>
          ))}
        </ul>

        </div>
      </div>

      {/* Trip Cards */}
      {/* Trip Cards */}
      {/* Trip Cards */}
      {/* Trip Cards */}
{trips.map((trip) => (
  <div key={trip._id} className="trip-card">
    <h3>{trip.tripName}</h3>

    {/* Destinations */}
    <p><strong>Destinations:</strong> 
      {trip.destinations?.map((dest, index) => (
        <span key={index}>
          {dest.city}, {dest.country}
          {index < trip.destinations.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>

    {/* Activities */}
    <p><strong>Activities:</strong></p>
    <ul>
      {trip.destinations?.map((dest, destIndex) =>
        dest.activities?.map((act, actIndex) => (
          <li key={`${destIndex}-${actIndex}`}>
            {act.name} - Status: {act.status || 'Pending'}
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
            >
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </li>
        ))
      )}
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

    {/* Upload Files */}
    <div className="file-upload">
      <h4>Upload File:</h4>
      <input
        type="file"
        onChange={(e) => handleFileUpload(e, trip._id)}
        accept="image/*,video/*,.pdf"
      />
    </div>
  </div>
))}



    </div>
  );
};

export default Dashboard;
