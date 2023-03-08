import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const ns = "sidebar";

export const Sidebar = () => {
  const rooms = ["general", "tech", "finance", "crypto"];
  const user = useSelector((state: any) => state?.user);

  return (
    <>
      {user && (
        <div className={ns}>
          <h2>Available rooms</h2>
          <ListGroup>
            {rooms.map((room, index) => (
              <ListGroup.Item key={index}>{room}</ListGroup.Item>
            ))}
          </ListGroup>
          <h2>Members</h2>
        </div>
      )}
    </>
  );
};
