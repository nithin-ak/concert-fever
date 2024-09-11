import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faRunning, faPalette, faBriefcase, faCamera } from '@fortawesome/free-solid-svg-icons';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const categoryData = [
  { name: "Music", icon: faMusic },
  { name: "Sport", icon: faRunning },
  { name: "Exhibition", icon: faPalette },
  { name: "Business", icon: faBriefcase },
  { name: "Photography", icon: faCamera },
];

const Categories = () => {
  return (
    <Container className="py-5">
      <div className="mb-5">
        <h2 className="mb-0">Explore By Categories</h2>
      </div>
      <Row className="justify-content-center text-center">
        {categoryData.map(({ name, icon }) => (
          <Col className="mb-4" key={name}>
            <Link to={`/events?category=${name}`} className="text-decoration-none">
              <Card className="text-center border-0 card-hover">
                <Card.Body>
                  <FontAwesomeIcon icon={icon} size="3x" className="mb-2" />
                  <Card.Title className="mb-0">{name}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Categories;
