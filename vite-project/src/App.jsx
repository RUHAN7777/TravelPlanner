import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddTrip from './pages/AddTrip';
import AddUser from './pages/RegisterUser';
import Login from './pages/LoginUser';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // 👈 Import the new component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<AddUser />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protect these routes */}
        <Route 
          path="/add-trip" 
          element={
            <ProtectedRoute>
              <AddTrip />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboards" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
