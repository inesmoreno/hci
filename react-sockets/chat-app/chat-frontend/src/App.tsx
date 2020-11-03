import React from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'
import {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    const body = async () => {
      const ws = new WebSocket("ws://localhost:3000/start-socket");
      console.log("started the socket!");
      ws.addEventListener('message', function (event) {
        console.log("i got a message from the server!");
        setMessages(ms => ms.concat(event.data));
      })
      setWs(ws);
    }
    body();
  }, []);

  const sendMessage = ((message: string) => {
    if(ws === null){
      return
    }
    ws.send(message)
  })
  const [message, setMessage] = useState<string>("");
  return (
    <div className="App">
      <p>
        hello world!
        </p>
      <div>
        <Form onSubmit={() => {sendMessage(message); setMessage("");}}>
          <Form.Group>
            <Form.Input
              //greyed out text before typing something
              placeholder='Message'
              //html specific tag -- not very useful in this context
              name='message'
              //the actual value of the content in the text box
              // note curly braces here are for injecting javascript!
              // not the same as making an obj as we are in "html" world
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Form.Button content='Submit' />
          </Form.Group>
        </Form>

      </div>
      <div className="messages">
        {//display messages from other users
        }
        {messages.map((x) => <p>{x}</p>)}
      </div>
    </div>
  );
}

export default App;
