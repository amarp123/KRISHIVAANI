import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import Features from './Features';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const slides = [
  { id: 1, image: '/images/Untitled design.png' },
  { id: 2, image: '/images/1000_F_645961919_oRvkwIWwIoJPVIawam6Q16wbvGKN3tL9.jpg' },
  { id: 3, image: '/images/bigstock-Farmer-Checking-The-Quality-Of-242888065.jpg' },
];

const Hero = () => {
  return (
    <div className="hero-section py-4 bg-light">

      <div className="w-100 px-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h1><strong>Speak. Grow. Prosper.</strong></h1>
            <p>Your AI-powered smart farming assistant. Ask anything — from crop suggestions to price predictions.</p>
            <Button variant="success"> Explore Krishivaani </Button>
          </Col>
          <Col md={6}>
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 2000 }}
              loop={true}
              spaceBetween={30}
              slidesPerView={1}
              
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <img
                    src={slide.image}
                    alt="Farming"
                    className="rounded w-100"
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToFeatures) {
      const featuresEl = document.getElementById('features');
      if (featuresEl) {
        setTimeout(() => {
          featuresEl.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div>
      <Hero />
      <div id="features">
        <Features />
      </div>
    </div>
  );
};

export default Home;
