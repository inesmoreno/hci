import React from "react";
import "./Chat.css";
import ChatInput from "./ChatInput";
import ChatOutput from "./ChatOutput";
import { UserInfo, Message } from "../../types";

function Chat({
  username,
  sendMessage,
  messages,
}: {
  username: string;
  sendMessage: (message: string) => void;
  messages: Message[];
}) {
  return (
    <>
      <p>Chat</p>
      <div className="chat">
        <ChatOutput messages={messages} myUsername={username} />
        <ChatInput sendMessage={sendMessage} />
      </div>
    </>
  );
}

export default Chat;
