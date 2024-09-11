import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Context from "../../Context"; // Adjust the import path as necessary
import { Container, Row, Col, Table, Button } from "react-bootstrap";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { setUserInfo } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const getCartFromCookie = () => {
      const cookies = document.cookie.split("; ");
      const cartCookie = cookies.find((cookie) => cookie.startsWith("cart="));
      return cartCookie ? JSON.parse(cartCookie.split("=")[1]) : [];
    };

    const cart = getCartFromCookie();
    setCartItems(cart);
    const calculateTotalPrice = cart.reduce(
      (total, item) => total + item.finalPrice,
      0
    );
    setTotalPrice(calculateTotalPrice.toFixed(2));
  }, []);

  const updateCartCookie = (cart) => {
    document.cookie = `cart=${JSON.stringify(cart)}; path=/`;
  };

  const handleDeleteItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    const newTotalPrice = updatedCart.reduce(
      (total, item) => total + item.finalPrice,
      0
    );
    setTotalPrice(newTotalPrice.toFixed(2));
    updateCartCookie(updatedCart);
    // Update cart qty info to context
    setUserInfo({ cart: updatedCart.length });
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    // Update cart qty info to context
    setUserInfo({ cart: 0 });
  };

  const handleProceedToCheckout = () => {
    updateCartCookie(cartItems);
    navigate(`/checkout`);
  };

  return (
    <Container className="py-4" style={{maxWidth: '800px'}}>
      <Row>
        <Col>
          <h1 className="text-center mb-4">Your Cart</h1>
          <Table striped bordered hover>
            <thead>
              <tr className="text-center">
                <th>Event Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Final Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td>{item.eventName}</td>
                    <td>{item.ticketCategory}</td>
                    <td>{item.quantity}</td>
                    <td>${item.finalPrice.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Your cart is empty
                  </td>
                </tr>
              )}
              {cartItems.length > 0 && (
                <tr>
                  <td colSpan="4" className="fw-bold text-end">
                    Total Price:
                  </td>
                  <td className="fw-bold">${totalPrice}</td>
                </tr>
              )}
            </tbody>
          </Table>
          {cartItems.length > 0 && (
            <div className="text-center mt-3">
              <Button
                onClick={handleClearCart}
                variant="secondary"
                className="me-2"
              >
                Clear Cart
              </Button>
              <Button onClick={handleProceedToCheckout} variant="primary">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
