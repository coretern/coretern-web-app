import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

// New Modular Pages
import LandingPage from './pages/LandingPage/LandingPage';
import Internships from './pages/Internships/Internships';
import InternshipDetails from './pages/InternshipDetails/InternshipDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import VerifyCertificate from './pages/VerifyCertificate/VerifyCertificate';
import ContactUs from './pages/ContactUs/ContactUs';
import TicketConversation from './pages/TicketConversation/TicketConversation';
import VideoPage from './pages/VideoPage/VideoPage';
import ServicesPage from './pages/Services/ServicesPage';
import ServiceDetails from './pages/ServiceDetails/ServiceDetails';
import EnrollmentPage from './pages/EnrollmentPage/EnrollmentPage';
import FloatingAction from './Components/FloatingAction/FloatingAction';
import ScrollToTop from './Components/ScrollToTop';

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage key={location.key} />} />
        <Route path="/internships" element={<Internships key={location.key} />} />
        <Route path="/internships/:id" element={<InternshipDetails key={location.key} />} />
        <Route path="/internships/:id/enroll" element={<EnrollmentPage key={location.key} />} />
        <Route path="/dashboard" element={<Dashboard key={location.key} />} />
        <Route path="/dashboard/videos/:id" element={<VideoPage key={location.key} />} />
        <Route path="/dashboard/tickets/:id" element={<TicketConversation key={location.key} />} />
        <Route path="/login" element={<Login key={location.key} />} />
        <Route path="/register" element={<Register key={location.key} />} />
        <Route path="/forgot-password" element={<ForgotPassword key={location.key} />} />
        <Route path="/contact" element={<ContactUs key={location.key} />} />
        <Route path="/services" element={<ServicesPage key={location.key} />} />
        <Route path="/services/:id" element={<ServiceDetails key={location.key} />} />
        <Route path="/verify/:id" element={<VerifyCertificate key={location.key} />} />
        <Route path="/verify" element={<VerifyCertificate key={location.key} />} />
      </Routes>
      <FloatingAction />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
