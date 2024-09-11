import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Table, Button, Alert } from "react-bootstrap";
import Context from "../../Context"; // Adjust the import path as necessary

const CheckoutPage = () => {
  const { userInfo, setUserInfo } = useContext(Context);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getCartFromCookie = () => {
      const cookies = document.cookie.split("; ");
      const cartCookie = cookies.find((cookie) => cookie.startsWith("cart="));
      return cartCookie ? JSON.parse(cartCookie.split("=")[1]) : [];
    };

    const fetchUserBalance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getuseraccountbalance?email=${userInfo.email}`
        );
        if (response.data !== undefined) {
          setBalance(response.data);
        } else {
          setError("User not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching user balance.");
        setLoading(false);
      }
    };

    const cart = getCartFromCookie();
    setCartItems(cart);
    const calculateTotalPrice = cart.reduce(
      (total, item) => total + item.finalPrice,
      0
    );
    setTotalPrice(calculateTotalPrice);

    fetchUserBalance();
  }, [userInfo.email]);

  const handleCompletePurchase = async () => {
    if (balance === null) return; // Don't proceed if balance is still being fetched

    if (balance < totalPrice) {
      setError("Insufficient balance.");
      return;
    }

    try {
      // Flatten cart items to individual tickets
      const flattenedTickets = cartItems.flatMap(
        ({ eventId, ticketCategory, finalPrice, quantity }) =>
          Array.from({ length: quantity }, (_, index) => ({
            eventId,
            ticketCategory,
            finalPrice,
            ticketIndex: index + 1, // Optional: helps identify individual tickets
          }))
      );

      const payload = {
        userId: userInfo.userId,
        couponId: 1, // Hardcoded couponId
        tickets: flattenedTickets,
      };

      const response = await axios.post(
        "http://localhost:8080/ticket/purchasetickets",
        payload
      );

      if (response.status === 201) {
        // Update cart qty info to context
        setUserInfo({ cart: 0 });
        alert("Checkout successful!");
        document.cookie =
          "cart=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
        navigate(`/`);
      } else {
        alert("Failed to complete checkout. Please try again.");
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Failed to complete checkout. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      <Row>
        <Col>
          <h1 className="text-center mb-4">Checkout</h1>
          <Table striped bordered hover>
            <thead>
              <tr className="text-center">
                <th>Event Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Final Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td>{item.eventName}</td>
                    <td>{item.ticketCategory}</td>
                    <td>{item.quantity}</td>
                    <td>${item.finalPrice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Your cart is empty
                  </td>
                </tr>
              )}
              {cartItems.length > 0 && (
                <tr>
                  <td colSpan="3" className="fw-bold text-end">
                    Total Price:
                  </td>
                  <td className="fw-bold text-center">${totalPrice}</td>
                </tr>
              )}
            </tbody>
          </Table>
          {cartItems.length > 0 && (
            <div className="text-center mt-3">
              <Button
                onClick={handleCompletePurchase}
                variant="primary"
                disabled={balance === null || balance < totalPrice}
              >
                Complete Purchase
              </Button>
              <p
                className={`mt-4 text-secondary text-center ${
                  balance < totalPrice ? "" : "d-none"
                }`}
              >
                Insufficient Balance - ${balance}
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
