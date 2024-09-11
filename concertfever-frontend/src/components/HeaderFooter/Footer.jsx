import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="fixed-bottom bg-light">
      <Container className='mt-3 d-flex justify-content-center'>
            <p>&copy; {new Date().getFullYear()} ConcertFever.com. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
