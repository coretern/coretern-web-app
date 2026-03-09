import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import ManualGenerator from './pages/ManualCertificateGenerator/ManualGenerator';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

const AppContent = ({ isAuthenticated, handleLogin }) => {
  const location = useLocation();

  return (
    <div className="admin-layout">
      {isAuthenticated && <Sidebar />}
      <main>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
          />
          <Route
            path="/forgot-password"
            element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard key={location.key} /> : <Navigate to="/login" />}
          />
          <Route
            path="/internships"
            element={isAuthenticated ? <ManageInternships key={location.key} /> : <Navigate to="/login" />}
          />
          <Route
            path="/enrollments"
            element={isAuthenticated ? <ManageEnrollments key={location.key} /> : <Navigate to="/login" />}
          />
          <Route
            path="/students"
            element={isAuthenticated ? <ManageUsers key={location.key} /> : <Navigate to="/login" />}
          />
          <Route
            path="/tickets"
            element={isAuthenticated ? <Tickets key={location.key} /> : <Navigate to="/login" />}
          />
          <Route
            path="/tickets/:id"
            element={isAuthenticated ? <TicketDetail key={location.key} /> : <Navigate to="/login" />}
          />
          <Route
            path="/manual-certificate"
            element={isAuthenticated ? <ManualGenerator key={location.key} /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </div>
  );
};

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
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.data.role === 'admin') {
          setIsAuthenticated(true);
        } else {
          // If the token belongs to a student, do NOT clear it immediately 
          // as they might have both apps open. Just reject in this context.
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Verify Admin Error:', err);
        // ONLY clear token if server explicitly says it's invalid/expired
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          // Network Error or 500: Stay "Authenticated" locally so they don't lose their page
          // Any subsequent protected requests will still fail if the token is truly bad.
          setIsAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
        <AppContent isAuthenticated={isAuthenticated} handleLogin={handleLogin} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
