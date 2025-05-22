import React from "react";
import { Container, Row, Col, Card,} from "react-bootstrap";

function Pricing() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/images6/GYM-Fitness-Wallpaper-HD.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center p-2 rounded">
        <img
          src="/images/image1.png" // Logonun yolunu buraya ekleyin
          alt="Salon Logo"
          className="me-2"
          style={{ width: "150px", height: "150px", objectFit: "contain" }}
        />
      </div>
      <div className="bg-transparent p-5 rounded shadow-sm w-50 w-md-50">
        <h2 className="text-center mb-4 text-white">Ücretlendirme Tarifeleri</h2>

        <Container>
          <Row className="g-4">
            <Col xs={12} md={6} lg={3}>
              <Card className="bg-dark text-white">
                <Card.Body>
                  <Card.Title className="text-center">1 Aylık</Card.Title>
                  <Card.Text className="text-center">
                    <h4>₺1000</h4>
                    <p className="text-center">Aylık üyelik ücreti</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="bg-dark text-white">
                <Card.Body>
                  <Card.Title className="text-center">3 Aylık</Card.Title>
                  <Card.Text className="text-center">
                    <h4>₺2500</h4>
                    <p className="text-center">3 aylık üyelik ücreti</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="bg-dark text-white">
                <Card.Body>
                  <Card.Title className="text-center">6 Aylık</Card.Title>
                  <Card.Text className="text-center">
                    <h4>₺4000</h4>
                    <p className="text-center">6 aylık üyelik ücreti</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="bg-dark text-white">
                <Card.Body>
                  <Card.Title className="text-center">1 Yıllık</Card.Title>
                  <Card.Text className="text-center">
                    <h4>₺7000</h4>
                    <p className="text-center">Yıllık üyelik ücreti</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Pricing;
