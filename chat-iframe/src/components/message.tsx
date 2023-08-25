import { FC } from "react";
import Loader from "./loader";

interface Props {
  sender: string;
  message: string;
}

const Message: FC<Props> = ({ message, sender }) => {
  return (
    <div className={`message ${sender !== "Hilda" ? "user-message" : ""}`}>
      <p>{sender}</p>
      <div>
        {message === "..." && sender !== "You" ? <Loader /> : message}
      </div>
    </div>
  );
};

export default Message;
