import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Context from "../Context";
import { Container, Spinner, Alert, Card, Row, Col } from "react-bootstrap";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(Context);
  const userEmail = userInfo.email;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/ticket/getalluserticketsbyemail?email=${userEmail}`
        );
        setTickets(data);
      } catch (err) {
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchTickets();
  }, [userEmail]);

  // Function to generate QR code URL and qrData
  const generateQRCodeDetails = (ticket) => {
    const { ticketId, eventEventId, userUserId } = ticket;
    const qrData = `cfvr${userUserId}${ticketId}${eventEventId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      qrData
    )}`;
    return { qrData, qrCodeUrl };
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Group tickets by event title
  const groupedTickets = tickets.reduce((acc, ticket) => {
    const eventName = ticket.eventEventName;
    if (!acc[eventName]) {
      acc[eventName] = [];
    }
    acc[eventName].push(ticket);
    return acc;
  }, {});

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-center">No tickets found.</p>
      ) : (
        <div>
          {Object.keys(groupedTickets).map((eventName) => (
            <div key={eventName}>
              <h4 className="mt-5 text-center">{eventName}</h4>
              {groupedTickets[eventName].map((ticket) => {
                const { qrData, qrCodeUrl } = generateQRCodeDetails(ticket);
                return (
                  <Row key={ticket.ticketId} className="mb-4 justify-content-center">
                    <Card className="shadow-sm" style={{maxWidth: '580px'}}>
                      <Card.Body className="d-flex justify-content-between align-items-center p-3">
                        <div className="w-75 mb-3">
                            <div>
                              <Card.Title className="text-nowrap">
                                {ticket.eventEventName}
                              </Card.Title>
                              <Card.Subtitle className="mb-2 text-nowrap fw-lighter">
                                {ticket.eventVenueVenueName}, {ticket.eventVenueCountry}
                              </Card.Subtitle>
                              <Card.Text className="text-nowrap">
                                <strong>Category:</strong> {ticket.ticketCategory}
                                <br />
                                <strong>Price:</strong> ${ticket.finalPrice.toFixed(2)}
                                <br />
                                <strong>Purchase Date:</strong> {new Date(ticket.purchaseDate).toLocaleDateString()}
                              </Card.Text>
                            </div>
                        </div>
                        <div>
                          <img src={qrCodeUrl} alt="QR Code" />
                          <div className="d-flex flex-column align-items-center bg-light">
                            <p className="mb-0 text-muted">{qrData}</p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Row>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default MyTickets;