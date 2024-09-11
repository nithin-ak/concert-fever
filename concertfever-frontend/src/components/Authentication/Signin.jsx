import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Context from "../../Context";
import { Form, Button, Alert } from "react-bootstrap";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const { setUserInfo } = useContext(Context);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email address.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { data: passwordValidation } = await axios.get(
        `http://localhost:8080/user/checkuserpassword?email=${email}&password=${password}`
      );
      if (Boolean(passwordValidation) === true) {
        const { data: user } = await axios.get(
          `http://localhost:8080/user/getuserbyemail?email=${email}`
        );
        setUserInfo({
          ...user,
          loggedIn: true,
        });
        // Send PUT request to update login time
        await axios.put(
          `http://localhost:8080/user/updateuserlogintime?email=${email}`
        );

        navigate("/");
      } else {
        setLoginError("Invalid password.");
      }
    } catch (error) {
      setLoginError("Invalid user account");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Sign In</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mt-3">
            <div className="d-flex justify-content-between">
              <Form.Label>Password</Form.Label>
              <Link to="/forgotpassword" className="text-decoration-none">
                Forgot password?
              </Link>
            </div>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {loginError && (
            <Alert variant="danger" className="mt-3">
              {loginError}
            </Alert>
          )}

          <Button variant="primary" type="submit" className="w-100 mt-3">
            Sign In
          </Button>
        </Form>

        <p className="text-center mt-4">
          Not a member?{" "}
          <Link to="/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
