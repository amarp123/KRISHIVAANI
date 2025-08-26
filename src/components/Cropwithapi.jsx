import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';

const CropSuggestionWithAPI = () => {
  const [language, setLanguage] = useState('en');
  const [name, setName] = useState('');
  const [soil, setSoil] = useState('');
  const [region, setRegion] = useState('');
  const [responseEn, setResponseEn] = useState('');
  const [responseKn, setResponseKn] = useState('');
  const [isListening, setIsListening] = useState(false);

  const synth = window.speechSynthesis;

  const speakText = (text, langCode) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    synth.speak(utter);
  };

  const handleVoiceStart = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert(language === 'kn' ? 'ಸ್ವರ ಮಾನ್ಯತೆ ಬೆಂಬಲಿತವಿಲ್ಲ' : 'Speech Recognition not supported');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';

    setIsListening(true);

    speakText(
      language === 'kn'
        ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು, ಮಣ್ಣು ಬಗೆ ಮತ್ತು ಪ್ರದೇಶವನ್ನು ಹೇಳಿ'
        : 'Please say your name, soil type, and region.',
      language === 'kn' ? 'kn-IN' : 'en-IN'
    );

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const parts = transcript.split(' ');
      setName(parts[0] || '');
      setSoil(parts[1] || '');
      setRegion(parts.slice(2).join(' ') || '');
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/dwani-crop-suggest', {
        name,
        soil,
        region,
      });

      setResponseEn(res.data.responseEn);
      setResponseKn(res.data.responseKn);

      if (language === 'kn') {
        speakText(res.data.responseKn, 'kn-IN');
      } else {
        speakText(res.data.responseEn, 'en-IN');
      }
    } catch (error) {
      console.error('Error fetching crop suggestion:', error);
      alert(language === 'kn' ? 'ಸೂಚನೆ ಪಡೆಯುವಲ್ಲಿ ದೋಷವಾಗಿದೆ' : 'Error fetching suggestion from server.');
    }
  };

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang) setLanguage(storedLang);
  }, []);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <Container className="py-5" id="crop-suggestion">
      <h2 className="text-center mb-4">
        {language === 'kn' ? '🌾 ಬೆಳೆ ಸೂಚನಾ ಸಹಾಯಕ' : '🌾 Crop Suggestion Assistant'}
      </h2>

      <div className="mb-4 text-center">
        <Form.Select value={language} onChange={handleLanguageChange} style={{ maxWidth: '200px', margin: '0 auto' }}>
          <option value="en">English</option>
          <option value="kn">ಕನ್ನಡ</option>
        </Form.Select>
      </div>

      <Row>
        <Col md={6} className="border-end">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'kn' ? '👤 ನಿಮ್ಮ ಹೆಸರು' : '👤 Your Name'}</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ' : 'Enter your name'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{language === 'kn' ? '🧪 ಮಣ್ಣಿನ ಬಗೆ' : '🧪 Soil Type'}</Form.Label>
              <Form.Control
                type="text"
                value={soil}
                onChange={(e) => setSoil(e.target.value)}
                placeholder={language === 'kn' ? 'ಮಣ್ಣಿನ ಬಗೆ ನಮೂದಿಸಿ' : 'Enter soil type'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{language === 'kn' ? '📍 ಪ್ರದೇಶ' : '📍 Region'}</Form.Label>
              <Form.Control
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={language === 'kn' ? 'ಪ್ರದೇಶ ನಮೂದಿಸಿ' : 'Enter region'}
              />
            </Form.Group>

            <Button variant="warning" onClick={handleVoiceStart} className="me-2">
              🎙️ {language === 'kn' ? 'ಶುರುಮಾಡಿ' : 'Start Speaking'}
              {isListening && (
                <motion.span
                  className="ms-2"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  
                </motion.span>
              )}
            </Button>

            <Button variant="success" onClick={handleSubmit}>
              {language === 'kn' ? 'ಸಲ್ಲಿಸು' : 'Submit'}
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <h4>{language === 'kn' ? '🗣️ AI ಶಿಫಾರಸು' : '🗣️ AI Suggestion'}</h4>

          {language === 'kn' ? (
            <motion.p
              className="bg-light p-3 rounded border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {responseKn || 'ಇಲ್ಲಿ ನಿಮ್ಮ ಬೆಳೆ ಶಿಫಾರಸು ಕಾಣಿಸುತ್ತದೆ...'}
            </motion.p>
          ) : (
            <>
              <motion.p
                className="bg-light p-3 rounded border mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {responseEn || 'Your suggestion will appear here...'}
              </motion.p>

              <h5>Kannada Version</h5>
              <motion.p
                className="bg-light p-3 rounded border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {responseKn || 'ಇಲ್ಲಿ ನಿಮ್ಮ ಬೆಳೆ ಶಿಫಾರಸು ಕಾಣಿಸುತ್ತದೆ...'}
              </motion.p>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CropSuggestionWithAPI;
