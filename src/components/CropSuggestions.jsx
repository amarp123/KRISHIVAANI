import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './CropSuggestionWithAPI.module.css';

const CropSuggestionWithAPI = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [form, setForm] = useState({ name: '', soil: '', region: '' });
  const [responses, setResponses] = useState({ en: '', kn: '' });
  const [isListening, setIsListening] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [ttsQueue, setTtsQueue] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/cropsuggestions');
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, []);

  const processTtsQueue = async () => {
    if (ttsQueue.length === 0 || isSpeaking) return;

    setIsSpeaking(true);
    const { text, langCode } = ttsQueue[0];

    try {
      setIsAudioLoading(true);

      if (langCode === 'kn-IN') {
        try {
          const { data } = await axios.post('http://localhost:5000/api/dwani-tts', 
            { text, lang: 'kn' },
            { timeout: 3000 }
          );

          if (data.audioUrl) {
            const audio = new Audio(data.audioUrl);
            audio.preload = 'auto';

            await new Promise((resolve) => {
              audio.onended = resolve;
              audio.onerror = resolve;
              audio.play().catch(resolve);
            });

            setTtsQueue(q => q.slice(1));
            return processTtsQueue();
          }
        } catch (apiError) {
          console.log('TTS API failed, falling back to browser');
        }
      }

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.rate = 1.0;

        await new Promise((resolve) => {
          utterance.onend = resolve;
          utterance.onerror = resolve;
          window.speechSynthesis.speak(utterance);
        });
      }

      setTtsQueue(q => q.slice(1));

    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsAudioLoading(false);
      setIsSpeaking(false);
      if (ttsQueue.length > 0) {
        setTimeout(processTtsQueue, 100);
      }
    }
  };

  useEffect(() => {
    if (ttsQueue.length > 0 && !isSpeaking) {
      processTtsQueue();
    }
  }, [ttsQueue]);

  const speakText = async (text, langCode) => {
    if (!text || typeof text !== 'string') return;
    setTtsQueue(q => [...q, { text, langCode }]);
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cropsuggestions');
      setHistory([]);
    } catch {
      alert(language === 'kn' ? 'ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸುವಲ್ಲಿ ದೋಷವಾಗಿದೆ' : 'Failed to clear history.');
    }
  };

  const handleDeleteHistoryItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cropsuggestions/${id}`);
      setHistory(h => h.filter(item => item._id !== id));
    } catch {
      alert(language === 'kn' ? 'ಇತಿಹಾಸದ ಐಟಂ ಅನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ' : 'Failed to delete history item.');
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleVoiceStart = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert(language === 'kn' ? 'ಸ್ವರ ಮಾನ್ಯತೆ ಬೆಂಬಲಿತವಿಲ್ಲ' : 'Speech Recognition not supported');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const parts = transcript.split(' ');
      setForm({
        name: parts[0] || '',
        soil: parts[1] || '',
        region: parts.slice(2).join(' ') || ''
      });
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, soil, region } = form;
    if (!name || !soil || !region) return;

    try {
      const { data } = await axios.post('http://localhost:5000/api/dwani-crop-suggest', {
        name,
        soil,
        region
      });

      setResponses({ 
        en: data.responseEn || '', 
        kn: data.responseKn || '' 
      });

      setHistory(h => [{
        _id: data._id || new Date().getTime().toString(),
        name,
        soil,
        region,
        responseEn: data.responseEn,
        responseKn: data.responseKn,
        createdAt: new Date().toISOString()
      }, ...h]);

      speakText(
        language === 'kn' ? data.responseKn : data.responseEn,
        language === 'kn' ? 'kn-IN' : 'en-IN'
      );

    } catch (error) {
      console.error('Error fetching suggestion:', error);
      alert(language === 'kn' ? 'ಶಿಫಾರಸು ಪಡೆಯುವಲ್ಲಿ ದೋಷವಾಗಿದೆ' : 'Error fetching suggestion.');
    }
  };

  const updateForm = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <Container className="py-5" id="crop-suggestion">
      <h2 className="text-center mb-4">
        {language === 'kn' ? '🌾 ಬೆಳೆ ಸೂಚನಾ ಸಹಾಯಕ' : '🌾 Crop Suggestion Assistant'}
      </h2>

      <div className="mb-4 text-center">
        <Form.Select 
          value={language} 
          onChange={handleLanguageChange} 
          style={{ maxWidth: '200px', margin: '0 auto' }}
        >
          <option value="en">English</option>
          <option value="kn">ಕನ್ನಡ</option>
        </Form.Select>
      </div>

      <Row>
        <Col md={6} className="border-end">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'kn' ? '👤 ನಿಮ್ಮ ಹೆಸರು' : '👤 Your Name'}</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={updateForm('name')}
                placeholder={language === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ' : 'Enter your name'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{language === 'kn' ? '🧪 ಮಣ್ಣಿನ ಬಗೆ' : '🧪 Soil Type'}</Form.Label>
              <Form.Control
                type="text"
                value={form.soil}
                onChange={updateForm('soil')}
                placeholder={language === 'kn' ? 'ಮಣ್ಣಿನ ಬಗೆ ನಮೂದಿಸಿ' : 'Enter soil type'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{language === 'kn' ? '📍 ಪ್ರದೇಶ' : '📍 Region'}</Form.Label>
              <Form.Control
                type="text"
                value={form.region}
                onChange={updateForm('region')}
                placeholder={language === 'kn' ? 'ಪ್ರದೇಶ ನಮೂದಿಸಿ' : 'Enter region'}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="warning" 
                onClick={handleVoiceStart} 
                disabled={isListening || isAudioLoading}
              >
                🎙️ {language === 'kn' ? 'ಶುರುಮಾಡಿ' : 'Start Speaking'}
                {isListening && (
                  <motion.span
                    className="ms-2"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    🔴
                  </motion.span>
                )}
              </Button>

              <Button 
                variant="success" 
                type="submit"
                disabled={!form.name || !form.soil || !form.region || isAudioLoading}
              >
                {isAudioLoading ? '⏳' : ''} {language === 'kn' ? 'ಸಲ್ಲಿಸು' : 'Submit'}
              </Button>
            </div>
          </Form>
        </Col>

        <Col md={6}>
          <h4>{language === 'kn' ? '🗣️ AI ಶಿಫಾರಸು' : '🗣️ AI Suggestion'}</h4>
          {language === 'kn' ? (
            <motion.div
              className="bg-light p-3 rounded border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ whiteSpace: 'pre-wrap', minHeight: '200px' }}
            >
              {responses.kn || (language === 'kn' ? 'ಇಲ್ಲಿ ನಿಮ್ಮ ಬೆಳೆ ಶಿಫಾರಸು ಕಾಣಿಸುತ್ತದೆ...' : 'Your suggestion will appear here...')}
            </motion.div>
          ) : (
            <>
              <motion.div
                className="bg-light p-3 rounded border mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ whiteSpace: 'pre-wrap', minHeight: '100px' }}
              >
                {responses.en || 'Your suggestion will appear here...'}
              </motion.div>
              <h5>Kannada Version</h5>
              <motion.div
                className="bg-light p-3 rounded border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ whiteSpace: 'pre-wrap', minHeight: '100px' }}
              >
                {responses.kn || 'ಇಲ್ಲಿ ನಿಮ್ಮ ಬೆಳೆ ಶಿಫಾರಸು ಕಾಣಿಸುತ್ತದೆ...'}
              </motion.div>
            </>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>{language === 'kn' ? '📜 ಶಿಫಾರಸು ಇತಿಹಾಸ' : '📜 Suggestion History'}</h4>
            {history.length > 0 && (
              <Button variant="danger" size="sm" onClick={handleClearHistory}>
                {language === 'kn' ? 'ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಿ' : 'Clear History'}
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-muted">{language === 'kn' ? 'ಯಾವುದೇ ಶಿಫಾರಸುಗಳಿಲ್ಲ' : 'No suggestions yet.'}</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>{language === 'kn' ? 'ಹೆಸರು' : 'Name'}</th>
                    <th>{language === 'kn' ? 'ಮಣ್ಣು' : 'Soil'}</th>
                    <th>{language === 'kn' ? 'ಪ್ರದೇಶ' : 'Region'}</th>
                    <th>{language === 'kn' ? 'ಉತ್ತರ' : 'Response'}</th>
                    <th>{language === 'kn' ? 'ಕ್ರಿಯೆಗಳು' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.soil}</td>
                      <td>{item.region}</td>
                      <td>{language === 'kn' ? item.responseKn : item.responseEn}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteHistoryItem(item._id)}
                        >
                          {language === 'kn' ? 'ಅಳಿಸಿ' : 'Delete'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CropSuggestionWithAPI;