import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Image } from 'react-bootstrap';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <div className="text-center mb-4">
              <Image 
                src={user.profilePic || "https://via.placeholder.com/100"} 
                roundedCircle 
                width="100" 
                height="100" 
                alt="Profile"
              />
              <h3 className="mt-3">👤 {user.name}</h3>
              <p className="text-muted">{user.role || "User"}</p>
            </div>

            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || 'Not Provided'}</p>
            <p><strong>Date of Birth:</strong> {user.dob || 'Not Provided'}</p>
            <p><strong>Location:</strong> {user.address || 'Not Provided'}</p>
            <p><strong>Joined:</strong> {user.joined}</p>

            <div className="d-grid gap-2 mt-4">
              <Button variant="primary" onClick={() => navigate('/edit-profile')}>
                Edit Profile
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
