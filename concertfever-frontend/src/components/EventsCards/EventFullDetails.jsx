import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const EventDetailsPage = () => {
  const { eventId } = useParams(); // Get event ID from URL params
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/event/geteventfulldetailsbyeventid?eventId=${eventId}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error fetching event details: {error}</p>;

  if (!event) return <p>No event found.</p>;

  return (
    <Container className="mt-4">
      <Row className="align-items-center">
        <Col md={6}>
          <img 
            src={`/assets/events/${event.eventId}.jpeg`} 
            alt={event.eventName} 
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
          />
        </Col>
        <Col md={6}>
          <h1>{event.eventName}</h1>
          <h5 className="text-muted">
            {event.venue.venueName}, {event.venue.country}
          </h5>
          <p>
            <strong>Description:</strong> {event.description}
          </p>
          <p>
            <strong>Dates:</strong>
            <div>
              <strong>From:</strong> {event.startDate}
            </div>
            <div>
              <strong>To:</strong> {event.endDate}
            </div>
          </p>
          <p>
            <strong>Address:</strong> {event.venue.address}, {event.venue.pinCode}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetailsPage;