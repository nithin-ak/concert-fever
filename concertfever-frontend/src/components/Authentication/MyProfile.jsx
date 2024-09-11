import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import Context from "../../Context";

const MyProfile = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [balance, setBalance] = useState(null); // State to store user balance
  const [topUpAmount, setTopUpAmount] = useState(""); // State for top-up amount
  const [topUpError, setTopUpError] = useState(""); // State for top-up errors
  const [topUpSuccess, setTopUpSuccess] = useState(""); // State for top-up success messages

  const { userInfo } = useContext(Context);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getuseraccountbalance?email=${userInfo.email}`
        );
        setBalance(response.data);
      } catch (error) {
        console.error("Failed to fetch user balance", error);
        setUpdateError("Failed to fetch user balance.");
      }
    };

    fetchBalance();
  }, [userInfo.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (!newPassword) newErrors.newPassword = "New password is required.";
    if (currentPassword === newPassword)
      newErrors.newPassword =
        "New password must be different from current password.";

    // Object.keys() converts key-value pair's "keys" into an array.
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Update the password
      await axios.put("http://localhost:8080/user/changeuserpassword", {
        email: userInfo.email,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      setUpdateSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setErrors("");
    } catch (error) {
      setUpdateError("Failed to update password.");
    }
  };

  const handleTopUp = async (event) => {
    event.preventDefault();

    if (!topUpAmount || isNaN(topUpAmount) || parseFloat(topUpAmount) <= 0) {
      setTopUpError("Please enter a valid top-up amount.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/user/topupaccountbalance`,
        null,
        {
          params: {
            email: userInfo.email,
            topUp: topUpAmount,
          },
        }
      );
      setTopUpSuccess("Balance topped up successfully.");
      setTopUpAmount("");
      // Refresh balance
      const response = await axios.get(
        `http://localhost:8080/user/getuseraccountbalance?email=${userInfo.email}`
      );
      setBalance(response.data);
    } catch (error) {
      console.error("Failed to top up balance", error);
      setTopUpError("Failed to top up balance.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="w-100" style={{ maxWidth: "800px" }}>
        <h2 className="text-center mb-4">My Profile</h2>
        <Row>
          <Col md={6}>
            <h4>Account Balance</h4>
            <Form onSubmit={handleTopUp}>
              <Form.Group controlId="formBalance" className="mt-3">
                <Form.Label>Current Balance</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={balance !== null ? `$${balance}` : "Loading..."}
                />
              </Form.Group>

              <Form.Group controlId="formTopUpAmount" className="mt-3">
                <Form.Label>Top-Up Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount to top up"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  isInvalid={!!topUpError}
                />
                <Form.Control.Feedback type="invalid">
                  {topUpError}
                </Form.Control.Feedback>
              </Form.Group>

              {topUpSuccess && (
                <Alert variant="success" className="mt-3">
                  {topUpSuccess}
                </Alert>
              )}

              <Button variant="success" type="submit" className="w-100 mt-3">
                Top Up Balance
              </Button>
            </Form>
          </Col>

          <Col md={6}>
            <h4>Password Update</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCurrentPassword" className="mt-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  isInvalid={!!errors.currentPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formNewPassword" className="mt-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  isInvalid={!!errors.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>

              {updateError && (
                <Alert variant="danger" className="mt-3">
                  {updateError}
                </Alert>
              )}
              {updateSuccess && (
                <Alert variant="success" className="mt-3">
                  {updateSuccess}
                </Alert>
              )}

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Update Password
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MyProfile;
