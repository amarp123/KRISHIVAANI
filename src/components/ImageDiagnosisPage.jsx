import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './ImageDiagnosisPage.css';

const commonDiseases = [
  {
    name: 'Powdery Mildew / ಪೌಡರಿ ಮಿಲ್ಡ್ಯೂ',
    imageUrl: 'https://gardenerspath.com/wp-content/uploads/2020/09/Tomato-Plant-Suffering-with-Botrytis-Gray-Mold.jpg',
    solution: 'Use sulfur-based fungicides and maintain good air circulation.\nಸಲ್ಫರ್ ಆಧಾರಿತ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ಬಳಸಿ ಮತ್ತು ಉತ್ತಮ ಗಾಳಿಚಲನವಲನವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ.',
  },
  {
    name: 'Leaf Rust / ಎಲೆ ಕಜ್ಜಳಿ',
    imageUrl: 'https://i0.wp.com/geopard.tech/wp-content/uploads/2021/12/Crop-Diseases_-Types-Causes-and-Symptoms-3-min-1.jpg?fit=1200%2C650&ssl=1',
    solution: 'Remove infected leaves and apply appropriate fungicides.\nಸಂಕ್ರಾಮಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಮತ್ತು ಸೂಕ್ತ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ಬಳಸಿ.',
  },
  {
    name: 'Blight / ಬ್ಲೈಟ್',
    imageUrl: 'https://tse1.mm.bing.net/th?id=OIP.05YCbGvrs9Vqtfta9hsUIAHaE7&pid=Api&P=0&h=180',
    solution: 'Use copper-based fungicides and avoid overhead watering.\nತಾಮ್ರ ಆಧಾರಿತ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ಬಳಸಿ ಮತ್ತು ಮೇಲ್ಮೈಯಿಂದ ನೀರಿನೊತ್ತಡವಿಲ್ಲದಿರಲಿ.',
  },
  {
    name: 'Downy Mildew / ಡೌನಿ ಮಿಲ್ಡ್ಯೂ',
    imageUrl: 'https://tse1.mm.bing.net/th?id=OIP.kLA_H_gJINllMTLPrv0zKQHaEK&pid=Api&P=0&h=180',
    solution: 'Improve air circulation and apply fungicide sprays.\nಹೆಚ್ಚು ಗಾಳಿಚಲನೆ ಒದಗಿಸಿ ಮತ್ತು ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಬಳಸಿರಿ.',
  },
  {
    name: 'Root Rot / ಬೇರು ಕೊಳೆ',
    imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.YJyHZ9kSs40h-aavDSJJBAHaFE&pid=Api&P=0&h=180',
    solution: 'Ensure proper drainage and avoid overwatering.\nಸರಿಯಾದ ನದಿಯನ್ನು ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಹೆಚ್ಚು ನೀರಿಡದಿರಿ.',
  },
  {
    name: 'Anthracnose / ಆಂಥ್ರಾಕ್ನೋಸ್',
    imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.wbNho5LS8ZCoW8O3IpU_AQHaE7&pid=Api&P=0&h=180',
    solution: 'Remove infected parts and apply fungicides.\nಸಂಕ್ರಾಮಿತ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಮತ್ತು ಶಿಲೀಂಧ್ರನಾಶಕ ಬಳಸಿ.',
  },
  {
    name: 'Bacterial Spot / ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಸ್ಪಾಟ್',
    imageUrl: 'https://tse1.mm.bing.net/th?id=OIP.K-akrirnR6g0xNhO7-A4RgHaD4&pid=Api&P=0&h=180',
    solution: 'Use copper sprays and disease-free seeds.\nತಾಮ್ರದ ಸ್ಪ್ರೇ ಮತ್ತು ರೋಗಮುಕ್ತ ಬೀಜಗಳನ್ನು ಬಳಸಿ.',
  },
  {
    name: 'Wilt / ಇಳಿಜಾರಿತನಕ',
    imageUrl: 'https://tse1.mm.bing.net/th?id=OIP.6nnozVMXcaZxQMKnacW7wgHaFj&pid=Api&P=0&h=180',
    solution: 'Solarize soil and rotate crops.\nಮಣ್ಣನ್ನು ಸೂರ್ಯರಶ್ಮಿಯಿಂದ ಶುದ್ಧಗೊಳಿಸಿ ಮತ್ತು ಬೆಳೆಗಳನ್ನು ಬದಲಾಯಿಸಿ.',
  },
  {
    name: 'Mosaic Virus / ಮೋಸಾಯಿಕ್ ವೈರಸ್',
    imageUrl: 'https://tse1.mm.bing.net/th?id=OIP.7rrr4-Y2KtGeIHUhFl_iigHaEF&pid=Api&P=0&h=180',
    solution: 'Remove affected plants and control insect vectors.\nಪೀಡಿತ ಸಸ್ಯಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಮತ್ತು ಕೀಟ ನಿಯಂತ್ರಣ ಮಾಡಿ.',
  },
  {
    name: 'Scab / ಸ್ಕ್ಯಾಬ್',
    imageUrl: 'https://tse3.mm.bing.net/th?id=OIP.MDQFtq3aOaunIuu3uI-O-wHaFg&pid=Api&P=0&h=180',
    solution: 'Apply lime and resistant varieties.\nಚೂನಾ ಬಳಸಿ ಮತ್ತು ಪ್ರತಿರೋಧಕ ತಳಿಗಳನ್ನು ಬಳಸಿರಿ.',
  },
];

const ImageDiagnosisPage = () => {
  const [image, setImage] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null); // ✅ File input ref

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setDiagnosisResult('');
    }
  };

  const analyzeImage = async () => {
  const file = fileInputRef.current?.files?.[0];
  if (!file) {
    console.warn("⚠️ No file selected");
    return;
  }

  setIsLoading(true);
  try {
    const formData = new FormData();
    formData.append('image', file);

    console.log("🔍 Sending image to backend...");
    const response = await fetch('http://localhost:5000/api/ai-diagnose', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log("✅ AI Diagnosis Response:", data);
    setDiagnosisResult(data.diagnosis);

   if ('speechSynthesis' in window) {
  const englishPart = data.diagnosis.split('\n\n')[1] || data.diagnosis;
  const utterance = new SpeechSynthesisUtterance(englishPart);
  utterance.lang = 'en-IN';
  window.speechSynthesis.speak(utterance);
}

  } catch (err) {
    console.error("❌ Error calling backend:", err);
    setDiagnosisResult('❌ Error analyzing image. Please try again.');
  }
  setIsLoading(false);
};


  return (
    <Container className="py-5">
      <h2 className="text-3xl font-bold text-center mb-4">📷 Crop Diagnosis / ಬೆಳೆ ರೋಗ ಪತ್ತೆ</h2>
      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body className="d-flex flex-column align-items-center">
              <input
                ref={fileInputRef} // ✅ Use ref
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="mb-3"
              />
              {image ? (
                <img src={image} alt="Selected crop" className="rounded w-100 mb-3" style={{ maxHeight: '300px', objectFit: 'cover' }} />
              ) : (
                <p className="text-muted">Upload or capture crop image / ಬೆಳೆ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಸೆರೆಹಿಡಿಯಿರಿ.</p>
              )}
              <Button onClick={analyzeImage} disabled={!image || isLoading}>
                {isLoading ? 'Analyzing... / ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...' : 'Analyze Image / ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h4 className="mb-3">Diagnosis Result / ರೋಗ ಪತ್ತೆ ಫಲಿತಾಂಶ</h4>
{diagnosisResult ? (
  <p style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
    {diagnosisResult}
  </p>
) : (
  <p>No diagnosis yet. / ಇನ್ನೂ ಫಲಿತಾಂಶವಿಲ್ಲ.</p>
)}
              <audio ref={audioRef} controls hidden />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="text-center mb-4">🌿 Common Crop Diseases / ಸಾಮಾನ್ಯ ಬೆಳೆ ರೋಗಗಳು</h3>
      <Row>
        {commonDiseases.map((disease, idx) => (
          <Col md={4} key={idx} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="disease-card">
                <img src={disease.imageUrl} alt={disease.name} />
                <div className="disease-overlay">
                  <h5 className="mb-2 fw-bold">{disease.name}</h5>
                  <p className="small" style={{ whiteSpace: 'pre-line' }}>{disease.solution}</p>
                </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ImageDiagnosisPage;