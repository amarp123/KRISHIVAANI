import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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

  const current = labels[language] || labels['en'];
  const location = useLocation();
  const navigate = useNavigate();

  const handleFeatureClick = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToFeatures: true } });
    } else {
      const el = document.getElementById('features');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">{current.krishivaani}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">{current.home}</Nav.Link>
            <Nav.Link onClick={handleFeatureClick}>{current.features}</Nav.Link>
            <Nav.Link as={Link} to="/login">{current.login}</Nav.Link>
            <Nav.Link as={Link} to="/profile">{current.profile}</Nav.Link>

            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-basic">
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
