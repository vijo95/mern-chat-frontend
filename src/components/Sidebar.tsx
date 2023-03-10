import { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";

const ns = "sidebar";

export const Sidebar = () => {
  const user = useSelector((state: any) => state?.user);
  const dispatch = useDispatch();
  const {
    socket,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom,
    members,
    setMembers,
    privateMemberMessage,
    setPrivateMemberMessage,
  } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, []);

  // socket for members
  socket.off("new-user").on("new-user", (payload: any) => {
    setMembers(payload);
  });

  // socket for notifications
  socket.off("notifications").on("notifications", (room: any) => {
    if (room !== currentRoom) {
      dispatch(addNotifications(room));
    }
  });

  // rooms
  const getRooms = async () => {
    await fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };

  // join room
  const joinRoom = (room: any, isPublic = true) => {
    if (!user) {
      return alert("Please login");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMessage(null);
    }

    // dispatch notification
    if (currentRoom !== room) {
      dispatch(resetNotifications(room));
    }
  };

  // sort Ids
  const sortIds = (id1: any, id2: any) => {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  };

  // join private member message
  const handlePrivateMemberMsg = (member: any) => {
    setPrivateMemberMessage(member);
    const roomId = sortIds(user?._id, member?._id);
    joinRoom(roomId, false);
  };

  return (
    <>
      {user && (
        <div className={ns}>
          <h2>Available rooms</h2>
          <ListGroup>
            {rooms.map((room: any, index: number) => (
              <ListGroup.Item
                key={index}
                onClick={() => joinRoom(room)}
                active={room === currentRoom}
                className={`${ns}__chat-item`}
              >
                {room}
                {currentRoom !== room && (
                  <span className="badge rounded-pill bg-primary">
                    {user?.newMessages[room]}
                  </span>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <h2>Members</h2>
          <ListGroup>
            {members.map((member: any, index: number) => (
              <div key={member?._id}>
                {member?._id !== user?._id && (
                  <ListGroup.Item
                    className={`${ns}__member`}
                    active={privateMemberMessage?._id === member?._id}
                    onClick={() => handlePrivateMemberMsg(member)}
                    disabled={member?._id === user?._id}
                  >
                    <Row className="align-items-center">
                      <Col xs={2} className={`${ns}__container-member-status`}>
                        <img
                          src={
                            member?.picture ||
                            "https://res.cloudinary.com/ddmgde7ln/image/upload/v1678217849/cld-sample-5.jpg"
                          }
                          className={`${ns}__member-status-image`}
                          alt="member-profile"
                        />
                        {member?.status === "online" ? (
                          <i
                            className={`fas fa-circle ${ns}__sidebar-status ${ns}__sidebar-online-status`}
                          ></i>
                        ) : (
                          <i
                            className={`fas fa-circle ${ns}__sidebar-status ${ns}__sidebar-offline-status`}
                          ></i>
                        )}
                      </Col>
                      <Col xs={9}>{member?.name} </Col>
                      <Col xs={1}>
                        <span className="badge rounded-pill bg-primary">
                          {user?.newMessages[sortIds(member?._id, user?._id)]}
                        </span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
              </div>
            ))}
          </ListGroup>
        </div>
      )}
    </>
  );
};
