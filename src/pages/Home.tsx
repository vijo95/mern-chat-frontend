import { Button, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const ns = "site-home";

export default function Home() {
  return (
    <Row className={ns}>
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <div>
          <h1> Share the world with your friends</h1>
          <p>Chat App lets you connect</p>
          <LinkContainer to="/chat">
            <Button variant="success">
              Get Started{" "}
              <i className={`fas fa-comments ${ns}__message-icon`}></i>
            </Button>
          </LinkContainer>
        </div>
      </Col>
      <Col md={6} className={`${ns}__bg`}></Col>
    </Row>
  );
}
