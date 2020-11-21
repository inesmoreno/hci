import React, {
  Fragment,
  useEffect,
  useState,
} from "react";
import "./App.css";
import { UserInfo, Message, Emoji } from "./types";

import Chat from "./components/Chat/Chat";
import EmojiSelector from "./components/EmojiSelector/EmojiSelector";
import Graph from "./components/Graph/Graph";
import EmojiGraph from "./components/EmojiGraph/EmojiGraph";
import HandQueue from "./components/HandQueue/HandQueue";
import HandList from "./components/HandList/HandList";
import LandingPage from "./components/LandingPage/LandingPage";
import { userInfo } from "os";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function MainPage({
  userInfo: { username, role },
}: {
  userInfo: UserInfo;
}) {
  //web socket
  const [ws, setWs] = useState<WebSocket | null>(null);
  //chat messages in the chat section
  const [chats, setChats] = useState<Message[]>([]);
  //graph histogram [#, #, #, #, #]
  const [histogram, setHistogram] = useState<number[]>([
    0,
    0,
    0,
    0,
    0,
  ]);
  const [emoji, setEmoji] = useState<Emoji[]>([]);
  const [hands, setHands] = useState<string[]>([]);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

  useEffect(() => {
    const body = async () => {
      const wsAddy =
        window.location.hostname !== "localhost"
          ? "/api"
          : "";
      const ws = new WebSocket(
        `ws://${window.location.host}${wsAddy}/start-socket`
      );
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
          setHistogram(serverMessage.data);
        }
        if (serverMessage.type === "hand") {
          setHands(serverMessage.data);
        }
        if (serverMessage.type === "emotes") {
          setEmoji(serverMessage.data);
        }
        //if msg.
      });
      setWs(ws);
    };
    body();
  }, []);
  const sendMessage = (message: string) => {
    if (ws === null) return;
    ws.send(
      JSON.stringify({
        type: "chat",
        data: message,
        author: username,
      })
    );
  };
  const sendVote = (vote: number, prevVote: number) => {
    if (ws === null) return;
    ws.send(
      JSON.stringify({
        type: "graph",
        vote: vote,
        prevVote: prevVote,
      })
    );
  };

  const sendHand = (username: string) => {
    if (ws === null) return;
    ws.send(
      JSON.stringify({ type: "hand", author: username })
    );
  };
  const sendEmoji = (
    emojiName: string,
    direction: string
  ) => {
    if (ws === null) return;
    ws.send(
      JSON.stringify({
        type: "emote",
        direction: direction,
        name: emojiName,
      })
    );
  };
  const clearHand = () => {
    if (ws === null) return;
    ws.send(
      JSON.stringify({ type: "clear", data: "hands" })
    );
  };

  const classes = useStyles();
  const generateAccordion = (header, body) => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {header}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="accordion">
          {body}
        </AccordionDetails>
      </Accordion>
    );
  };
  return (
    <>
      <div className="main">
        <div className="relier"> R e l i e r </div>
        {generateAccordion(
          "Level of Understanding",
          <Graph
            histogram={histogram}
            sendVote={sendVote}
            role={role}
          />
        )}

        {generateAccordion(
          "Hand Queue",
          role === "presenter" ? (
            <HandList
              removeHand={sendHand}
              hands={hands}
              clearHand={clearHand}
            />
          ) : (
            <HandQueue
              sendHand={sendHand}
              hands={hands}
              username={username}
            />
          )
        )}
        {generateAccordion(
          "Reaction Panel",
          <>
            <EmojiGraph histogram={emoji} />
            {role === "presenter" ? (
              ""
            ) : (
              <EmojiSelector sendEmoji={sendEmoji} />
            )}
          </>
        )}
        {generateAccordion(
          "Chat",
          <Chat
            username={username}
            sendMessage={sendMessage}
            messages={chats}
          />
        )}
      </div>
    </>
  );
}

export default MainPage;
