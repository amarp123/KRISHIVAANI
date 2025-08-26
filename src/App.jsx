import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Components
import AppNavbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CropSuggestions from './components/CropSuggestions';
import Login from './components/Login';
import Profile from './components/Profile';
import ImageDiagnosisPage from './components/ImageDiagnosisPage';
import LiveWindowDashboard from './components/LiveWindowDashboard';
import AuthPage from './components/AuthPage';
import PricePredict from './components/PricePredict';

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToFeatures) {
      const el = document.getElementById('features');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Features />
    </>
  );
}

function App() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Router>
      <AppNavbar language={language} setLanguage={setLanguage} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/crop-suggestions" element={<CropSuggestions language={language} />} />
        <Route path="/image-diagnosis" element={<ImageDiagnosisPage />} />
        <Route path="/live-window-dashboard" element={<LiveWindowDashboard />} />
        <Route path="/pricepredict" element={<PricePredict />} />
      </Routes>
    </Router>
  );
}

export default App;
