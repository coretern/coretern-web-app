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
import Terms from './pages/Terms/Terms';
import Privacy from './pages/Privacy/Privacy';
import RefundPolicy from './pages/RefundPolicy/RefundPolicy';
import AboutUs from './pages/AboutUs/AboutUs';
import FloatingAction from './Components/FloatingAction/FloatingAction';
import ScrollToTop from './Components/ScrollToTop';
import CookieBanner from './Components/CookieBanner/CookieBanner';

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="bottom-center"
        containerStyle={{
          zIndex: 999999,
        }}
      />
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
        <Route path="/terms" element={<Terms key={location.key} />} />
        <Route path="/privacy" element={<Privacy key={location.key} />} />
        <Route path="/refund-policy" element={<RefundPolicy key={location.key} />} />
        <Route path="/about" element={<AboutUs key={location.key} />} />
      </Routes>
      <FloatingAction />
      <CookieBanner />
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
