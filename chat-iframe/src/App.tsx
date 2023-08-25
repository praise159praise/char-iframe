import userIcon from "./images/default-user.png";
import "./App.css";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Message from "./components/message";
import { useRef, useState } from "react";

interface Messages {
  sender: string;
  messageContent: string;
}
function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const lastMessage = useRef<null | HTMLDivElement>(null); 
  const socket = new WebSocket(
    "wss://ahaf4qaa55.execute-api.us-east-1.amazonaws.com/dev"
  );

  const sendMessage = (messageContent: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", messageContent },
      { sender: "Hilda", messageContent: "..." },
    ]);

    socket.onopen = function (e) {
      socket.send(
        JSON.stringify({
          action: "prompt",
          orgId: "1a2b3c",
          data: { message: message },
        })
      );
    };

    socket.onmessage = function (event) {
      let data = JSON.parse(event.data);

      let messageContent = data.data.message?.content;

      if (messageContent) {
        setMessages((prevMessages) => {
          prevMessages[prevMessages.length - 1] = {
            sender: "Hilda",
            messageContent,
          };
          return [...prevMessages];
        });
        
        socket.close();
        lastMessage.current?.scrollIntoView({ behavior: "smooth" })
      }
    
    };
  };
 

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={userIcon} alt="user icon" />
        <div>
          <p>ASK HILDA</p>
          <p>Online</p>
        </div>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <Message sender={message.sender} message={message.messageContent} key={index} />
        ))}
      </div>
      <div ref={lastMessage}/>
      <div className="chat-input">
        <input
          type="text"
          name=""
          id=""
          placeholder="Ask Hilda"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage(message);
              (e.target as HTMLInputElement).value = ''
            }
          }}
        />
        <div
          onClick={(e) => {
            (e.target as HTMLInputElement).value = "";
            sendMessage(message);
          }}
        >
          <ChatBubbleLeftEllipsisIcon />
        </div>
      </div>
    </div>
  );
}

export default App;
