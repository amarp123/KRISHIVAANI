import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row>
          <Col md={6}>
            <p>© 2025 KrishiVaani. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-end">
            <a href="#" className="text-light me-2">Privacy</a>
            <a href="#" className="text-light me-2">Contact</a>
            <a href="#" className="text-light">Help</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
