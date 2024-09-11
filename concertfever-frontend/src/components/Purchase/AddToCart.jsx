import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Context from "../../Context";

const AddToCart = () => {
  const { eventId } = useParams();
  const { userInfo, setUserInfo } = useContext(Context);
  const [tickets, setTickets] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/event/geteventfulldetailsbyeventid?eventId=${eventId}`
        );
        setTickets(data.ticketCategoryDto || []);
        setEventTitle(data.eventName || "");
      } catch (err) {
        setError("Error fetching tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [eventId]);

  const getCartFromCookie = () => {
    const cookies = document.cookie.split("; ");
    const cartCookie = cookies.find((cookie) => cookie.startsWith("cart="));
    return cartCookie ? JSON.parse(cartCookie.split("=")[1]) : [];
  };

  const handleTicketSelection = (ticketCategory, qty) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.ticketCategory === ticketCategory);
      return existing
        ? prev.map((t) =>
            t.ticketCategory === ticketCategory ? { ...t, qty } : t
          )
        : [...prev, { ticketCategory, qty }];
    });
  };

  const handleSubmit = () => {
    try {
      const newCartItems = selectedTickets
        .filter((ticket) => ticket.qty > 0)
        .map((ticket) => ({
          eventId,
          eventName: eventTitle,
          ticketCategory: ticket.ticketCategory,
          quantity: ticket.qty,
          finalPrice:
            ticket.qty *
            (tickets.find(
              (t) => t.ticketCategoryIdTicketCategory === ticket.ticketCategory
            )?.price || 0),
        }));

      // Retrieve existing cart from cookie
      const existingCartItems = getCartFromCookie();

      // Merge new items with existing items
      const updatedCart = [
        ...existingCartItems,
        ...newCartItems.filter(
          (newItem) =>
            !existingCartItems.some(
              (item) =>
                item.eventId === newItem.eventId &&
                item.ticketCategory === newItem.ticketCategory
            )
        ),
      ];

      // Save updated cart to cookie
      document.cookie = `cart=${JSON.stringify(updatedCart)}; path=/;`;

      // Update cart qty info to context
      setUserInfo({ cart: updatedCart.length });

      setMessage("Added to cart");
    } catch (err) {
      setMessage("Failed to add to cart");
    }
  };

  const calculateFinalPrice = (price, qty) => (price * qty).toFixed(2);

  const totalPrice = selectedTickets
    .reduce((total, ticket) => {
      const ticketData = tickets.find(
        (t) => t.ticketCategoryIdTicketCategory === ticket.ticketCategory
      );
      return total + (ticketData ? ticketData.price * ticket.qty : 0);
    }, 0)
    .toFixed(2);

  if (loading) return <Spinner animation="border" />;
  if (error)
    return <Alert variant="danger">Error loading contents: {error}</Alert>;

  return (
    <div className="content mx-auto px-4 py-6">
      <h4 className="text-center p-4">Categories</h4>
      <div className="table-responsive mx-auto" style={{ maxWidth: "800px" }}>
        <Table className="table table-bordered table-sm text-center">
          <thead className="table-light">
            <tr>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Final Price</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => {
                const selected = selectedTickets.find(
                  (t) =>
                    t.ticketCategory === ticket.ticketCategoryIdTicketCategory
                );
                const qty = selected ? selected.qty : 0;
                return (
                  <tr key={ticket.ticketCategoryIdTicketCategory}>
                    <td>{ticket.ticketCategoryIdTicketCategory}</td>
                    <td className="d-flex justify-content-center">
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={qty}
                        onChange={(e) =>
                          handleTicketSelection(
                            ticket.ticketCategoryIdTicketCategory,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="form-control form-control-sm text-center"
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>${ticket.price.toFixed(2)}</td>
                    <td>${calculateFinalPrice(ticket.price, qty)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No tickets available
                </td>
              </tr>
            )}
            <tr className="table-light">
              <td colSpan="3" className="font-weight-bold text-end">
                Total Price:
              </td>
              <td className="font-weight-bold text-center">${totalPrice}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <Button
          onClick={handleSubmit}
          disabled={!userInfo.loggedIn}
          variant="primary"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          Add To Cart
        </Button>
      </div>
      <p
        className={`mt-4 text-secondary text-center ${
          userInfo.loggedIn ? "d-none" : ""
        }`}
      >
        Please login to make a purchase
      </p>
      {message && <p className="mt-4 text-success text-center">{message}</p>}
    </div>
  );
};

export default AddToCart;
