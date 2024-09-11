import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

/**
 * EventCard component displays a card for a single event.
 * It includes an image, title, venue, description, date range, address, and the lowest ticket price.
 * Provides a button to navigate to the event details page.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.event - Event data to display
 * @param {string} props.event.eventId - Unique identifier for the event
 * @param {string} props.event.eventName - Name of the event
 * @param {Object} props.event.venue - Venue information
 * @param {string} props.event.venue.venueName - Name of the venue
 * @param {string} props.event.venue.country - Country where the venue is located
 * @param {string} props.event.venue.address - Address of the venue
 * @param {string} props.event.venue.pinCode - Postal code of the venue
 * @param {string} props.event.description - Description of the event
 * @param {string} props.event.startDate - Start date of the event (ISO format)
 * @param {string} props.event.endDate - End date of the event (ISO format)
 * @param {Array} props.event.ticketCategoryDto - List of ticket categories with their prices
 * @returns {JSX.Element} The rendered EventCard component
 *
 * @example
 * const event = {
 *   eventId: 1,
 *   eventName: 'Music Festival',
 *   venue: {
 *     venueName: 'Grand Hall',
 *     country: 'USA',
 *     address: '123 Main St',
 *     pinCode: '12345'
 *   },
 *   description: 'An exciting music festival with top artists.',
 *   startDate: '2024-09-01',
 *   endDate: '2024-09-03',
 *   ticketCategoryDto: [
 *     { price: 100 },
 *     { price: 150 }
 *   ]
 * };
 *
 * return (
 *   <EventCard event={event} />
 * );
 */
const EventCard = ({ event }) => {
  /**
   * Get the lowest ticket price from the ticket categories.
   * Returns "N/A" if no ticket categories are available.
   *
   * @param {Array} ticketCategories - Array of ticket categories
   * @returns {string} The lowest price or "N/A"
   */
  const getLowestPrice = (ticketCategories) => {
    if (!ticketCategories || ticketCategories.length === 0) return "N/A";
    const prices = ticketCategories.map((tc) => tc.price);
    return Math.min(...prices);
  };

  return (
    <div className="col-md-4 mb-4">
      <Card style={{ height: "100%" }}>
        <Card.Body className="d-flex flex-column">
          <Card.Img
            variant="top"
            src={`/assets/events/${event.eventId}.jpeg`}
            alt={event.eventName}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <span className="position-absolute top-0 end-0 m-4 badge rounded-pill bg-light text-dark">
            From ${getLowestPrice(event.ticketCategoryDto)}
          </span>
          <Card.Title className="mt-2">{event.eventName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {event.venue.venueName}, {event.venue.country}
          </Card.Subtitle>
          <Card.Text>
            <strong>Description:</strong> {event.description}
          </Card.Text>
          <Card.Text>
            <strong>Dates:</strong>
            <div className="fw-lighter">
              <strong>From:</strong> {event.startDate} <strong>| To:</strong>{" "}
              {event.endDate}
            </div>
          </Card.Text>
          <Card.Text>
            <strong>Address:</strong> {event.venue.address},{" "}
            {event.venue.pinCode}
          </Card.Text>
          <Button
            className="mt-auto"
            as={Link}
            to={`/eventdetails/${event.eventId}`}
            variant="primary"
          >
            View Details
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EventCard;
