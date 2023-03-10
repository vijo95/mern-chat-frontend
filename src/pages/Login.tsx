import { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { useLoginUserMutation } from "../services/api";
const ns = "site-login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const { socket } = useContext(AppContext);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state?.user);

  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, []);

  // login
  const handleLogin = async (e: any) => {
    e.preventDefault();
    loginUser({ email, password }).then((data: any) => {
      if (data?.data) {
        // socket work
        socket.emit("new-user");
        // navigate to chat
        navigate("/chat");
      }
    });
  };

  return (
    <Container className={ns}>
      <Row>
        <Col md={5} className={`${ns}__bg`}></Col>
        <Col
          md={7}
          className={`d-flex align-items-center justify-content-center flex-direction-column`}
        >
          <Form className={`${ns}__form`} onSubmit={handleLogin}>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              {error && (
                <p className="alert alert-danger">
                  Something went wrong, please try again
                </p>
              )}
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Login"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
