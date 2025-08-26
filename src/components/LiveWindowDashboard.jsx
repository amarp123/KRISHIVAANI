import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaMicrophone, FaPlayCircle } from 'react-icons/fa';
import { WiDaySunny } from 'react-icons/wi';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const LiveVoiceDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voiceResponse, setVoiceResponse] = useState('');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en');

  const apiKey = 'fb9ccf0f422ed3a3e59bdbc063d6642a';

  useEffect(() => {
    AOS.init({ duration: 800 });
    getLocationAndFetchWeather();
  }, []);

  const getLocationAndFetchWeather = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        setWeather(res.data);
        setLoading(false);
        speakWeather(res.data);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setLoading(false);
      }
    });
  };

  const speakText = (text, langCode) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
  };

  const speakWeather = (data) => {
    const msg = language === 'kn'
      ? `ಇದು ${data.name} ನಗರದಲ್ಲಿ ತಾಪಮಾನ ${data.main.temp} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್`
      : `Current temperature in ${data.name} is ${data.main.temp} degrees Celsius.`;
    speakText(msg, language === 'kn' ? 'kn-IN' : 'en-US');
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      fetchAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
    };
  };

  const fetchAnswer = async (q) => {
    setVoiceResponse(language === 'kn' ? 'ಉತ್ತರ ಪಡೆಯುತ್ತಿದೆ...' : 'Loading answer...');
    try {
      const res = await fetch('http://localhost:5000/api/gemini-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language })
      });
      const data = await res.json();
      setVoiceResponse(data.answer);
    } catch (err) {
      setVoiceResponse(language === 'kn' ? 'ಉತ್ತರ ಪಡೆಯುವಲ್ಲಿ ದೋಷವಾಯಿತು.' : 'Failed to get answer.');
    }
  };

  const handleTextSubmit = () => {
    if (query) fetchAnswer(query);
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4" data-aos="fade-up">
        🌾 <strong>Krishi Vaani: Voice Assistant</strong>
      </h2>

      <Form.Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 w-auto mx-auto d-block"
      >
        <option value="en">English</option>
        <option value="kn">Kannada</option>
      </Form.Select>

      <Card className="p-4 mb-4 shadow-lg border-0 rounded-4 bg-light" data-aos="fade-up">
        <h5><WiDaySunny /> Live Weather</h5>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="mt-3">
            <p><strong>📍 Location:</strong> {weather.name}</p>
            <p><strong>🌡️ Temperature:</strong> {weather.main.temp} °C</p>
            <p><strong>💧 Humidity:</strong> {weather.main.humidity}%</p>
            <p><strong>🌬️ Wind:</strong> {weather.wind.speed} m/s</p>
            <p><strong>☁️ Condition:</strong> {weather.weather[0].description}</p>
          </div>
        )}
      </Card>

      <Card className="p-4 mb-4 shadow-lg border-0 rounded-4" data-aos="fade-up">
        <h5><FaMicrophone /> Ask Anything (Voice + Text)</h5>
        <Row className="align-items-center">
          <Col md={9} className="my-2">
            <input
              type="text"
              className="form-control form-control-lg"
              value={query}
              placeholder="Ask about weather, farming tips..."
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col md={3} className="my-2 d-flex gap-2">
            <Button size="lg" variant="primary" onClick={handleTextSubmit}>Ask</Button>
            <Button size="lg" variant="success" onClick={handleVoiceInput}>
              🎙️ Voice
            </Button>
          </Col>
        </Row>
        {voiceResponse && <p className="mt-4 p-3 bg-light rounded text-success">🔊 {voiceResponse}</p>}
      </Card>

      <Card className="p-4 shadow-lg border-0 rounded-4" data-aos="fade-up">
        <h5><FaPlayCircle /> Recommended Videos</h5>
        <Carousel
          arrows
          autoPlay
          autoPlaySpeed={3000}
          infinite
          responsive={{
            desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
            tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
            mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
          }}
          itemClass="px-3"
        >
          {[
            'O7wpt3xy1O8',
            '1yXe8lLQix8',
            'w9iF_2vjX2c',
            'ZxNw65L9e7g',
            't9lKq-77CwY'
          ].map((id, idx) => (
            <div key={idx} className="rounded overflow-hidden">
              <iframe
                width="100%"
                height="250"
                src={`https://www.youtube.com/embed/${id}`}
                title={`Recommended Video ${idx + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded w-100"
              ></iframe>
            </div>
          ))}
        </Carousel>
      </Card>
    </Container>
  );
};

export default LiveVoiceDashboard;
