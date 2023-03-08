import { Col, Container, Row } from "react-bootstrap";
import { MessageForm } from "../components/MessageForm";
import { Sidebar } from "../components/Sidebar";

export default function Chat() {
  return (
    <Container>
      <Row>
        <Col md={4}>
          <Sidebar />
        </Col>
        <Col md={8}>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
}
