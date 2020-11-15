import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { UserInfo, Message } from "./types";

import Chat from "./components/Chat/Chat";
import EmojiSelector from "./components/EmojiSelector/EmojiSelector";
import Graph from "./components/Graph/Graph";
import EmojiGraph from "./components/EmojiGraph/EmojiGraph";

function MainPage({ userInfo: { username } }: { userInfo: UserInfo }) {
  //web socket
  const [ws, setWs] = useState<WebSocket | null>(null);
  //chat messages in the chat section
  const [chats, setChats] = useState<Message[]>([]);
  //graph histogram [#, #, #, #, #]
  const [histogram, setHistogram] = useState<number[]>([0, 0, 0, 0, 0]);
  const [emoji, setEmoji] = useState<object>({});

  useEffect(() => {
    const body = async () => {
      const ws = new WebSocket(`ws://${window.location.host}/api/start-socket`);
      //"message" here is a message from the server, not a necessarily a chat msg
      ws.addEventListener("message", function (event) {
        //what to do when you get something from the server

        const serverMessage = JSON.parse(event.data);
        //msg = json.parse event data
        //if msg.type = "chat" do this
        //and what we do is update the chat state for display
        if (serverMessage.type === "chat")
          setChats((ms) =>
            ms.concat({
              message: serverMessage.data,
              author: serverMessage.author,
            })
          );

        if (serverMessage.type === "graph") {
          console.log("printing the chart results form the backend");
          console.log(serverMessage.data);
          setHistogram(serverMessage.data);
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

  return (
    <>
      <Graph histogram={histogram} sendVote={sendVote} />
      <EmojiGraph histogram={emoji} sendEmoji={sendEmoji} />
      <Chat username={username} sendMessage={sendMessage} messages={chats} />
    </>
  );
}

export default MainPage;
