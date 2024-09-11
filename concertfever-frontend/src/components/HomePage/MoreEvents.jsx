import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import EventCard from "../EventsCards/EventCard";

/**
 * EventListPreview component fetches and displays a preview of events.
 * It shows a subset of events (3 random events) and handles loading and error states.
 * Users can navigate to the full list of events by clicking the "View All Events" button.
 *
 * @component
 * @example
 * return (
 *   <EventListPreview />
 * );
 */
function EventListPreview() {
  const [events, setEvents] = useState([]); // State to store events data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle error messages

  /**
   * Fetch events from the API when the component mounts.
   * Handles setting events data, loading state, and error state.
   */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/event/getalleventsfulldetails"
        );
        setEvents(data); // Set events data on successful fetch
      } catch (err) {
        setError("Failed to load events."); // Set error message on failure
      } finally {
        setLoading(false); // Set loading to false when fetch is complete
      }
    };

    fetchEvents();
  }, []);

  // Randomly select a subset of events to display (3 events)
  const number = Math.floor(Math.random() * (events.length - 2));

  // Display a spinner while loading
  if (loading) return <Spinner animation="border" />;

  // Display an error message if fetching events fails
  if (error)
    return <Alert variant="danger">Error fetching events: {error}</Alert>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">More Events</h2>
        <Button as={Link} to="/events" variant="primary">
          View All Events
        </Button>
      </div>
      <div className="row">
        {events.slice(number, number + 3).map((event) => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventListPreview;
