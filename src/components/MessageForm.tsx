import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";

const ns = "message-form";

export const MessageForm = () => {
  const [message, setMessage] = useState("");
  const messageEndRef = useRef<any>(null);
  const { socket, currentRoom, messages, setMessages } = useContext(AppContext);
  const user = useSelector((state: any) => state?.user);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // format date
  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    month = 1 < month.length ? month : "0" + month;
    let day = date.getDate().toString();
    day = 1 < day.length ? day : "0" + day;

    return day + "/" + month + "/" + year;
  };

  // today date
  const todayDate = getFormattedDate();

  // socket for messages
  socket.off("room-messages").on("room-messages", (roomMessages: any) => {
    setMessages(roomMessages);
  });

  // send new message
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!message) {
      return;
    }

    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  };

  const scrollToBottom = () => {
    messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={ns}>
      {/* MESSAGES CONTAINER */}
      <div className={`${ns}__output`}>
        {!user && <div className="alert alert-danger">Please login</div>}
        {user &&
          messages.map(({ _id: date, messagesByDate }: any, index: number) => (
            <div key={index}>
              <p className="alert alert-info text-center">{date}</p>
              {messagesByDate.map(
                ({ content, time, from: sender }: any, index: number) => (
                  <div
                    className={`${ns}__container-message  ${
                      sender?.email === user?.email ? `${ns}__own-message` : ""
                    }`}
                    key={index}
                  >
                    <div className={`${ns}__sender-profile`}>
                      <img
                        alt="profile"
                        src={
                          sender?.picture ||
                          "https://res.cloudinary.com/ddmgde7ln/image/upload/v1678217849/cld-sample-5.jpg"
                        }
                        className={`${ns}__sender-profile-image`}
                      />
                      <span className={`${ns}__sender-name`}>
                        {sender?.name}
                      </span>
                    </div>
                    <span className={`${ns}__message-content`}>{content}</span>
                    <span className={`${ns}__message-time`}>{time}</span>
                  </div>
                )
              )}
            </div>
          ))}
        <div ref={messageEndRef} />
      </div>

      {/* MESSAGE INPUT */}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                disabled={!user}
                type="text"
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
