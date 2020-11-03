import React from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'
import {useEffect, useState} from 'react';
import logo from './logo.svg';
import ChatInput from './ChatInput';
import ChatOutput from './ChatOutput';
import { UserInfo, Message } from './types';

function Chat({userInfo:{username}}:{userInfo : UserInfo}) {

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    const body = async () => {
      const ws = new WebSocket("ws://localhost:4000/start-socket");
      ws.addEventListener('message', function (event) {
        setMessages(ms => ms.concat(JSON.parse(event.data)));
      })
      setWs(ws);
    }
    body();
  }, []);

  const sendMessage = ((message: string) => {
    if(ws === null){
      return
    }
    ws.send(JSON.stringify({message: message, author:username}))
  })

  return (
    <>
      <p>
        Chat
      </p>
      < ChatOutput messages={messages} myUsername={username} />
      < ChatInput sendMessage={sendMessage} />
    </>
  );
}

export default Chat;
