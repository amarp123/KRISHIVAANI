import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AppNavbar.css';

const AppNavbar = ({ language, setLanguage }) => {
  const labels = {
    en: {
      home: 'Home',
      features: 'Features',
      login: 'Login',
      profile: 'Profile',
      language: '🌐 Language',
      krishivaani: '🌿 KrishiVaani'
    },
    kn: {
      home: 'ಮುಖಪುಟ',
      features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
      login: 'ಲಾಗಿನ್',
      profile: 'ಪ್ರೊಫೈಲ್',
      language: '🌐 ಭಾಷೆ',
      krishivaani: '🌿 ಕೃಷಿವಾಣಿ'
    }
  };

  const current = labels[language] || labels.en;
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFeatureClick = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToFeatures: true } });
    } else {
      const el = document.getElementById('features');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Navbar expand="lg" sticky="top" className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-modern">
          {current.krishivaani}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="nav-modern-link">{current.home}</Nav.Link>
            <Nav.Link onClick={handleFeatureClick} className="nav-modern-link">{current.features}</Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-modern-button">{current.login}</Nav.Link>
            <Nav.Link onClick={() => navigate('/profile')} className="nav-modern-link">
              {current.profile}
            </Nav.Link>
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" className="language-dropdown">
                {current.language}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setLanguage('en')}>English</Dropdown.Item>
                <Dropdown.Item onClick={() => setLanguage('kn')}>ಕನ್ನಡ</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
