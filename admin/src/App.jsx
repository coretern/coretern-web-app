import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';

import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import ManageInternships from './pages/ManageInternships/ManageInternships';
import ManageEnrollments from './pages/ManageEnrollments/ManageEnrollments';
import ManageUsers from './pages/ManageUsers/ManageUsers';
import Tickets from './pages/Tickets/Tickets';
import TicketDetail from './pages/Tickets/TicketDetail';
import Login from './pages/Login/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.data.role === 'admin') {
          setIsAuthenticated(true);
        } else {
          // If token exists but role is not admin (e.g. student logged in main app)
          console.warn('Student token found in Admin context - Access Denied');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0b', color: 'white' }}>
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

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
              <Route
                path="/tickets/:id"
                element={isAuthenticated ? <TicketDetail /> : <Navigate to="/login" />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
