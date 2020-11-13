import React from "react";
import { Button, Checkbox, Form } from "semantic-ui-react";
import { useEffect, useState } from "react";
import logo from "./logo.svg";
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
      <ChatOutput messages={messages} myUsername={username} />
      <ChatInput sendMessage={sendMessage} />
    </>
  );
}

export default Chat;
