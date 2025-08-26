import React from 'react';
import { Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Hero.css';

const slides = [
  { id: 1, image: '/images/1000_F_505106167_bNt2Zcb1yPHDrgwsOzeDAu7C1omydTCy.jpg', title: 'Speak. Grow. Prosper.',
    subtitle: 'Your AI-powered smart farming assistant.', },
  { id: 2, image: '/images/1000_F_645961919_oRvkwIWwIoJPVIawam6Q16wbvGKN3tL9.jpg',title: 'Get Smart Crop Suggestions',
    subtitle: 'Personalized recommendations based on your soil and region.', },
  { id: 3, image: '/images/bigstock-Farmer-Checking-The-Quality-Of-242888065.jpg',title: 'Diagnose Diseases Instantly',
    subtitle: 'Just upload an image — let AI do the rest.', },
];

const Hero = () => {
  const scrollToFeatures = () => {
    const section = document.getElementById('features');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-wrapper">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000 }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        className="hero-swiper"
      >
         {slides.map((slide) => (
    <SwiperSlide key={slide.id}>
      <div
        className="hero-slide"
        style={{ backgroundImage: `url(${slide.image})`, height: '85vh' }}
      >
        <div className="hero-gradient"></div>
        <div className="hero-overlay fade-in">
          <h1 className="hero-title">{slide.title}</h1>
          <p className="hero-subtitle">{slide.subtitle}</p>
          <Button variant="light" onClick={scrollToFeatures}>Explore KrishiVaani</Button>
        </div>
      </div>
    </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
