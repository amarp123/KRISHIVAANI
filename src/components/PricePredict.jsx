import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Pie, Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const PricePrediction = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef(null);

  const priceData = {
    labels: ['Tomato', 'Potato', 'Onion', 'Carrot'],
    datasets: [
      {
        label: 'Current Price (₹/kg)',
        data: [25, 18, 30, 40],
        backgroundColor: ['#f94144', '#f3722c', '#90be6d', '#577590'],
      },
    ],
  };

  const trendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Tomato Price (₹/kg)',
        data: [22, 24, 27, 25],
        fill: false,
        borderColor: '#f94144',
        tension: 0.1,
      },
      {
        label: 'Potato Price (₹/kg)',
        data: [17, 18, 19, 18],
        fill: false,
        borderColor: '#f3722c',
        tension: 0.1,
      },
    ],
  };

  const regionData = {
    labels: ['Bangalore', 'Mysore', 'Dharwad', 'Mangalore'],
    datasets: [
      {
        label: 'Average Price (₹/kg)',
        data: [24, 26, 22, 28],
        backgroundColor: '#43aa8b',
      },
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const englishResponse = `Current price for tomatoes is ₹25/kg. Ideal week to sell: Week 3. Best region: Mangalore.`;
    const kannadaResponse = `ಟೊಮೆಟೊಗಳ ಪ್ರಸ್ತುತ ಬೆಲೆ ಪ್ರತಿ ಕಿಲೋಗ್ರಂಗೆ ₹25. ಮಾರಾಟಕ್ಕೆ ಉತ್ತಮ ಸಮಯ: 3ನೇ ವಾರ. ಉತ್ತಮ ಪ್ರದೇಶ: ಮಂಗಳೂರು.`;
    const fullResponse = `English:\n${englishResponse}\n\nKannada:\n${kannadaResponse}`;
    setResponse(fullResponse);
    speakText(englishResponse, 'en-IN');
    speakText(kannadaResponse, 'kn-IN');
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech Recognition not supported');

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
    };
    recognitionRef.current.start();
  };

  const speakText = (text, lang) => {
    if (!text || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">📈 Crop Price Prediction</h2>

      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <Form onSubmit={handleSubmit} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Ask about crop prices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="primary" type="submit">Ask</Button>
            <Button variant="success" type="button" onClick={startListening}>🎙️ Speak</Button>
          </Form>
        </Col>
      </Row>

      {response && (
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <Card className="p-3 shadow" style={{ whiteSpace: 'pre-wrap' }}>
              <strong>Response:</strong>
              <br />
              {response}
            </Card>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <h5 className="text-center">Crop Price Comparison</h5>
          <Pie data={priceData} />
        </Col>
        <Col md={6}>
          <h5 className="text-center">Price Trends (Last Month)</h5>
          <Line data={trendData} />
        </Col>
      </Row>

      <Row>
        <Col md={8} className="mx-auto">
          <h5 className="text-center">Best Region to Sell</h5>
          <Bar data={regionData} />
        </Col>
      </Row>
    </Container>
  );
};

export default PricePrediction;




