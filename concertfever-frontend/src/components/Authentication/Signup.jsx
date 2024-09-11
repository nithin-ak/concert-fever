import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Context from "../../Context";
import { Form, Button, Alert } from "react-bootstrap";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState("");

  const navigate = useNavigate();
  const { setUserInfo } = useContext(Context);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email address.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        accountBalance: 1000, // Set default balance or adjust as needed
      };

      await axios.post("http://localhost:8080/user/createnewuser", newUser);

      const { data: user } = await axios.get(
        `http://localhost:8080/user/getuserbyemail?email=${email}`
      );
      setUserInfo({
        ...user,
        loggedIn: true
      });

      navigate("/");
    } catch (error) {
      setSignupError("Error creating account. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              isInvalid={errors.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicLastName" className="mt-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              isInvalid={errors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicEmail" className="mt-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {signupError && (
            <Alert variant="danger" className="mt-3">
              {signupError}
            </Alert>
          )}

          <Button variant="primary" type="submit" className="w-100 mt-3">
            Sign Up
          </Button>
        </Form>

        <p className="text-center mt-4">
          Already a member?{" "}
          <Link to="/signin" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
