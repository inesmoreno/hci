import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { UserInfo, Message } from "./types";

import Chat from "./components/Chat/Chat";
import EmojiSelector from "./components/EmojiSelector/EmojiSelector";
import Graph from "./components/Graph/Graph";
import EmojiGraph from "./components/EmojiGraph/EmojiGraph";
import HandQueue from "./components/HandQueue/HandQueue";
import HandList from "./components/HandList/HandList";
import LandingPage from "./components/LandingPage/LandingPage";
import { userInfo } from "os";

function MainPage({ userInfo: { username, role } }: { userInfo: UserInfo }) {
  //web socket
  const [ws, setWs] = useState<WebSocket | null>(null);
  //chat messages in the chat section
  const [chats, setChats] = useState<Message[]>([]);
  //graph histogram [#, #, #, #, #]
  const [histogram, setHistogram] = useState<number[]>([0, 0, 0, 0, 0]);
  const [emoji, setEmoji] = useState<object>({});
  const [hands, setHands] = useState<string[]>([]);

  useEffect(() => {
    const body = async () => {
      const ws = new WebSocket(`ws://localhost:4000/start-socket`);
      //const ws = new WebSocket(`ws://${window.location.host}/api/start-socket`);
      //"message" here is a message from the server, not a necessarily a chat msg
      ws.addEventListener("message", function (event) {
        //what to do when you get something from the server

        const serverMessage = JSON.parse(event.data);
        //msg = json.parse event data
        //if msg.type = "chat" do this
        //and what we do is update the chat state for display
        if (serverMessage.type === "chat") {
          console.log("I got a message");
          setChats((ms) =>
            ms.concat({
              message: serverMessage.data,
              author: serverMessage.author,
            })
          );
        }

        if (serverMessage.type === "graph") {
          console.log("printing the chart results form the backend");
          console.log(serverMessage.data);
          setHistogram(serverMessage.data);
        }
        if (serverMessage.type === "hand") {
          console.log("HAND!!");
          console.log(serverMessage.data);
          setHands(serverMessage.data);
        }
        //if msg.
      });
      setWs(ws);
    };
    body();
  }, []);
  const sendMessage = (message: string) => {
    if (ws === null) return;
    ws.send(JSON.stringify({ type: "chat", data: message, author: username }));
  };
  const sendVote = (vote: number, prevVote: number) => {
    if (ws === null) return;
    ws.send(JSON.stringify({ type: "graph", vote: vote, prevVote: prevVote }));
  };

  const sendHand = () => {
    console.log(11);
    if (ws === null) return;
    ws.send(JSON.stringify({ type: "hand", author: username }));
  };

  const minusCnt = (id: number, cnt: number) => {
    setEmoji({
      ...emoji,
      [id]: cnt,
    });
  };
  const sendEmoji = (id: number) => {
    console.log(id);
    const cnt = emoji[id] || 0;
    setEmoji({
      ...emoji,
      [id]: 1 + cnt,
    });
    // if (ws === null) return;
    // ws.send(JSON.stringify({ type: "graph", vote: vote, prevVote: prevVote }));
  };

  const temphis: object = {};

  console.log(username);
  console.log(role);
  return (
    <>
      <Graph histogram={histogram} sendVote={sendVote} role={role} />
      {/* <HandQueue sendHand={sendHand} hands={hands} />
      <HandList hands={hands} /> */}
      {role === "presenter" ? (
        <HandList sendHand={sendHand} hands={hands} />
      ) : (
        <HandQueue sendHand={sendHand} hands={hands} />
      )}
      <EmojiGraph histogram={emoji} sendEmoji={sendEmoji} role={role} />
      <Chat username={username} sendMessage={sendMessage} messages={chats} />
    </>
  );
}

export default MainPage;
