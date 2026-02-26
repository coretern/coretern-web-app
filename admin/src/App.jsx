import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import ManageInternships from './pages/ManageInternships/ManageInternships';
import ManageEnrollments from './pages/ManageEnrollments/ManageEnrollments';
import ManageUsers from './pages/ManageUsers/ManageUsers';
import Tickets from './pages/Tickets/Tickets';
import Login from './pages/Login/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => setIsAuthenticated(true);

  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <div className="admin-layout">
          {isAuthenticated && <Sidebar />}
          <main>
            <Routes>
              <Route
                path="/login"
                element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
              />
              <Route
                path="/"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/internships"
                element={isAuthenticated ? <ManageInternships /> : <Navigate to="/login" />}
              />
              <Route
                path="/enrollments"
                element={isAuthenticated ? <ManageEnrollments /> : <Navigate to="/login" />}
              />
              <Route
                path="/students"
                element={isAuthenticated ? <ManageUsers /> : <Navigate to="/login" />}
              />
              <Route
                path="/tickets"
                element={isAuthenticated ? <Tickets /> : <Navigate to="/login" />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
