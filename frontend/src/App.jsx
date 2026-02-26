import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

// New Modular Pages
import LandingPage from './pages/LandingPage/LandingPage';
import Internships from './pages/Internships/Internships';
import InternshipDetails from './pages/InternshipDetails/InternshipDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import VerifyCertificate from './pages/VerifyCertificate/VerifyCertificate';
import ContactUs from './pages/ContactUs/ContactUs';
import FloatingAction from './Components/FloatingAction/FloatingAction';
import ScrollToTop from './Components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/verify/:id" element={<VerifyCertificate />} />
          <Route path="/verify" element={<VerifyCertificate />} />
        </Routes>
        <FloatingAction />
      </Router>
    </ThemeProvider>
  );
}

export default App;
