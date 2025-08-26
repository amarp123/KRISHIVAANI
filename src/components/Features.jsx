import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Features.css';

const features = [
  {
    title: 'Crop Suggestions',
    icon: '🌱',
    short: 'Get the best crops for your soil and region.',
    more: 'Based on your location and soil conditions, we recommend ideal crops to maximize yield.',
    link: '/crop-suggestions',
  },
  {
    title: 'Price Predict',
    icon: '📈',
    short: 'Know when to sell your crops for better prices.',
    more: 'Using past market data and trends, we estimate the best time to sell your produce.',
    link: '/pricepredict'
  },
  {
    title: 'Image Diagnosis',
    icon: '📷',
    short: 'Take a photo and detect diseases instantly.',
    more: 'AI-powered image recognition helps identify crop diseases and provides treatments.',
    link: '/image-diagnosis',
  },
  {
    title: 'Live Dashboard',
    icon: '📊',
    short: 'Track weather, alerts, and get timely advice.',
    more: 'View real-time weather, alerts, and farming insights on a single dashboard.',
    link: '/live-window-dashboard',
  },
];

const Features = () => {
  const navigate = useNavigate();

  const handleCardClick = (link) => {
    if (link) navigate(link);
  };

  return (
   <Container fluid className="features-section py-5" id="features">

      <h2 className="text-center display-5 fw-bold mb-5 text">🌾 Features of KrishiVaani</h2>
      <Row className="justify-content-center">
        {features.map((feature, index) => (
          <Col key={index} md={6} lg={3} className="mb-4">
            <Card
              className={`feature-card ${feature.link ? 'clickable' : ''}`}
              onClick={() => handleCardClick(feature.link)}
            >
              <Card.Body>
                <div className="icon">{feature.icon}</div>
                <div className="title">{feature.title}</div>
                <div className="short">{feature.short}</div>
                <div className="more">{feature.more}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Features;
