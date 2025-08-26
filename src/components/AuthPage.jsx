import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields');
      return;
    }

    if (isLogin) {
      
      const user = { email, name: 'John Doe', joined: 'May 2025' };
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/profile');
    } else {
      
      const user = { email, name, joined: 'May 2025' };
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/profile');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg rounded-4 p-4">
            <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Create Account'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {!isLogin && (
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-2">
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </Form>

            <div className="text-center mt-3">
              {isLogin && (
                <>
                  <small className="d-block mb-2 text-muted">Forgot your password?</small>
                </>
              )}
              <small>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <Button variant="link" onClick={toggleForm} className="p-0">
                  {isLogin ? 'Create Account' : 'Login'}
                </Button>
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;
