import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import hero_video from '../../assets/hero.mp4';

function Hero() {
  return (
    <div className="position-relative w-100" style={{ height: '50vh' }}>
      {/* Video Background */}
      <video
        src={hero_video}
        autoPlay
        muted
        loop
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ zIndex: -10 }}
      />

      {/* Content */}
      <Container fluid className="d-flex align-items-center justify-content-center h-100 ">
        <Row className="text-center text-white">
          <Col>
            <h1 className="display-5 fw-bold">Home of your</h1>
            <h1 className="display-3 fw-bold">favourite</h1>
            <h1 className="display-2 fw-bolder">events</h1>
            <p className="mt-4 fs-5">
              Discover Unforgettable Experiences at Spectacular Events!
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Hero;
