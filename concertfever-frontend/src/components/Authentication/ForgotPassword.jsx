import { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    try {
      const response = await axios.put(
        `http://localhost:8080/user/forgot-password?email=${email}`
      );
      if (response.status === 200) {
        setMessage("Password reset successfully. Please check your email for a temporary password.");
        setError("");
      }
    } catch (err) {
      setError("Error resetting password. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>

          {message && (
            <Alert variant="success" className="mt-3">
              {message}
            </Alert>
          )}

          {/* {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )} */}

          <Button variant="primary" type="submit" className="w-100 mt-3">
            Reset Password
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
