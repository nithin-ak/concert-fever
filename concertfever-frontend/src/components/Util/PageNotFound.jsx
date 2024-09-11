import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

function PageNotFound() {
  return (
    <Container className="text-center my-5 justify-content-center">
      <h1 className="display-1">404</h1>
      <p className="lead">That’s an error.</p>
      <p>The requested URL was not found on this server.</p>
      <p className="text-muted">That’s all we know.</p>
      <Link to="/">
        <Button variant="primary">Homepage</Button>
      </Link>
    </Container>
  );
}

export default PageNotFound;
