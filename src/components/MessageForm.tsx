import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const ns = "message-form";

export const MessageForm = () => {
  const user = useSelector((state: any) => state?.user);
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className={ns}>
      <div className={`${ns}__output`}>
        {!user && <div className="alert alert-danger">Please login</div>}
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                disabled={!user}
                type="text"
                placeholder="Your message"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              className={`${ns}__cta`}
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
