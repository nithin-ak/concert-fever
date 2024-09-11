import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo-black.svg";
import Context from "../../Context";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const navigation = [
  { name: "Home", to: "/" },
  { name: "Events", to: "/events?category=" },
  { name: "My Tickets", to: "/mytickets" },
];

function NavigationBar() {
  const { userInfo, setUserInfo } = useContext(Context);
  const navigate = useNavigate();
  const [cartItemsQty, setCartItemsQty] = useState(0);

  const userName = `${userInfo.firstName} ${userInfo.lastName}`;

  const handleLogout = () => {
    setUserInfo({ loggedIn: false, email: "" });
    document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/signin"); // Redirect to login page
  };

  // Find the cart qty
  useEffect(() => {
    setCartItemsQty(userInfo.cart);
  });

  return (
    <header>
      <Navbar bg="light" data-bs-theme="light" className="shadow" fixed="top">
        <Container>
          {/* The brand icon */}
          <Navbar.Brand as={Link} to="/" className="flex-even">
            <img
              alt="logo"
              src={logo}
              className="img-fluid mx-2"
              style={{ maxWidth: "25px" }}
            />{" "}
            <span className="text-secondary">ConcertFever</span>
          </Navbar.Brand>

          {/* Sublinks declared in navigation const */}
          <Nav className="flex-even justify-content-center">
            {navigation.map((item, index) =>
              item.name === "My Tickets" && !userInfo.loggedIn ? null : (
                <Nav.Link key={index} as={Link} to={item.to}>
                  {item.name}
                </Nav.Link>
              )
            )}
          </Nav>

          {/* Login, logout, cart buttons */}
          <Nav className="flex-even justify-content-end">
            {userInfo.loggedIn ? (
              <>
                {/* Cart button */}
                <Nav.Link as={Link} to="/cart" className="position-relative">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-secondary"
                    aria-hidden="true"
                  />
                  {cartItemsQty > 0 && (
                    <span className="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                      {cartItemsQty}
                    </span>
                  )}
                </Nav.Link>

                <Nav.Link as={Link} to="/myprofile">
                  {userName}
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  Log out
                </Nav.Link>
              </>
            ) : (
              // Login Button
              <Nav.Link as={Link} to="/signin">
                Log In
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

export default NavigationBar;
