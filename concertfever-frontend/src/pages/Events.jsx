import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faRunning,
  faPalette,
  faBriefcase,
  faCamera,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import EventCard from "../components/EventsCards/EventCard";
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container"

const categoryIcons = {
  Music: faMusic,
  Sport: faRunning,
  Exhibition: faPalette,
  Business: faBriefcase,
  Photography: faCamera,
  All: faFilter,
};

const EventsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [categories] = useState([
    "Music",
    "Sport",
    "Exhibition",
    "Business",
    "Photography",
    "All",
  ]);
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url =
          selectedCategory === ""
            ? `http://localhost:8080/event/getalleventsfulldetails`
            : `http://localhost:8080/event/geteventfulldetailsbycategory?category=${selectedCategory}`;

        const response = await axios.get(url);
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, [selectedCategory]);

  useEffect(() => {
    const searchLower = searchQuery.toLowerCase();
    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchLower)
    );
    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, events]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url =
          selectedCategory === ""
            ? `http://localhost:8080/event/getalleventsfulldetails`
            : `http://localhost:8080/event/geteventfulldetailsbycategory?category=${selectedCategory}`;

        const response = await axios.get(url);
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    navigate(`?category=${value}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (error)
    return <Alert variant="danger">Error fetching events: {error}</Alert>;

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  // Create pagination items
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Event Listings</h1>
      
      <Container className="mb-4 d-flex justify-content-between">
        <div className="d-flex align-items-center">
          {categories.map((cat) => (
            <Form.Check
              inline
              key={cat}
              type="radio"
              id={`category-${cat}`}
              label={
                <>
                  <FontAwesomeIcon icon={categoryIcons[cat]} /> {cat}
                </>
              }
              name="category"
              value={cat === "All" ? "" : cat}
              checked={selectedCategory === (cat === "All" ? "" : cat)}
              onChange={handleCategoryChange}
              className="me-3"
            />
          ))}
        </div>
        <Form.Control
            inline
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="d-flex"
            style={{ maxWidth: "300px" }}
          />
      </Container>

      <div className="row">
        {paginatedEvents.map((event) => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>{paginationItems}</Pagination>
      </div>
    </div>
  );
};

export default EventsPage;
