import fasty from "fastify";
import { Emote } from "./types";
import websocket, { SocketStream } from "fastify-websocket";
import { setUncaughtExceptionCaptureCallback } from "process";
import { Socket } from "dgram";

//step one, init fastify
const app = fasty({ logger: true });
// registering adds a plugin to our framework
// we want websocket!
app.register(websocket);

//mega monster global variable
//of ALL that clients!! o/
const conns: SocketStream[] = [];
var histogram: number[] = [0, 0, 0, 0, 0];
let whoIsIn = new Set<string>();
function updatewhoIsIn(name: string) {
  if (whoIsIn.has(name)) whoIsIn.delete(name);
  else whoIsIn.add(name);

  return whoIsIn;
}

//function updateHist ({newVote, prevVote}:{newVote : number, prevVote: number}) {
function updateHist(newVote: number, prevVote: number) {
  const tempHist = histogram;
  if (prevVote !== -1)
    tempHist.splice(
      prevVote - 1,
      1,
      tempHist[prevVote - 1] - 1
    );
  if (newVote >= 0) {
    tempHist.splice(
      newVote - 1,
      1,
      tempHist[newVote - 1] + 1
    );
  }
  histogram = tempHist;
  return histogram;
}

var hands: string[] = [];
//function updateList
function updateList(hand: string) {
  var index = hands.indexOf(hand);
  if (index === -1) hands.push(hand);
  else hands.splice(index, 1);
  return hands;
}

const globalEmotes: Emote[] = [];
const topFiveEmotes = () =>
  globalEmotes
    .sort((x, y) => y.count - x.count)
    .slice(0, 5)
    .filter(({ count }) => count > 0);

const sendToAll = (message: string) =>
  conns.forEach((con: SocketStream) => {
    con.socket.send(message);
  });
//registering routes
//if you send a get req to the root of the app,
//here is how we'll deal with it
app.get("/", (request, reply) => {
  reply
    .header("content-type", "text/html")
    .send("<!doctype html><html></html>");
});

app.get(
  "/start-socket",
  { websocket: true },
  (connection, req) => {
    //adds connection to the list of connections
    conns.push(connection);
    //anything defined here will be associated with the connection
    //this way we store some state info per user!

    //handler to broadcast message to all
    //handlers register event types to functions
    // we are handlign a particular event type, the message event
    let louVote: number = -1;
    let handRaised: boolean;
    let clientEmotes = new Set<string>();
    let author: string;

    [
      { type: "hand", data: hands },
      { type: "graph", data: histogram },
      { type: "emotes", data: topFiveEmotes() },
      { type: "name", data: whoIsIn },
    ].map((x) => connection.socket.send(JSON.stringify(x)));

    connection.socket.on("message", (message: string) => {
      //this is were we handle requests from the client

      //console.log(message);
      const jsonMsg = JSON.parse(message);
      console.log(JSON.stringify(jsonMsg, null, 2));
      if (jsonMsg.type === "chat") sendToAll(message);
      if (jsonMsg.type === "graph") {
        sendToAll(
          JSON.stringify({
            type: "graph",
            data: updateHist(
              jsonMsg.vote,
              jsonMsg.prevVote
            ),
          })
        );
        louVote = jsonMsg.vote;
      }

      if (jsonMsg.type === "name") {
        author = jsonMsg.author;
        sendToAll(
          JSON.stringify({
            type: "name",
            data: Array.from(
              updatewhoIsIn(jsonMsg.author).values()
            ),
          })
        );
      }

      if (jsonMsg.type === "hand") {
        const data = updateList(jsonMsg.author);

        sendToAll(
          JSON.stringify({
            type: "hand",
            data,
          })
        );
        handRaised = data.some(
          (nameInList) => nameInList === jsonMsg.author
        );
      }

      if (jsonMsg.type === "emote") {
        //the index of the emoji count we are going to be updating
        const changeIndex = globalEmotes.findIndex(
          (item) => item.name === jsonMsg.name
        );

        //if the emote we are updating is not in the list of server known emotes,
        //add it! and you're done!
        if (changeIndex === -1) {
          globalEmotes.push({
            name: jsonMsg.name,
            count: 1,
          });
          clientEmotes.add(jsonMsg.name);
        }
        //if the emote to add is in the list,
        //check if it's and upvote or downvote
        //and apply that change
        else if (jsonMsg.direction === "up") {
          globalEmotes[changeIndex] = {
            name: globalEmotes[changeIndex].name,
            count: globalEmotes[changeIndex].count + 1,
          };
          clientEmotes.add(jsonMsg.name);
        } else {
          globalEmotes[changeIndex] = {
            name: globalEmotes[changeIndex].name,
            count: globalEmotes[changeIndex].count - 1,
          };
          clientEmotes.delete(jsonMsg.name);
        }
        sendToAll(
          JSON.stringify({
            type: "emotes",
            data: topFiveEmotes(),
          })
        );
      }
      if (jsonMsg.type === "clear") {
        if (jsonMsg.data === "hands") {
          hands.splice(0, hands.length);
          sendToAll(
            JSON.stringify({
              type: "hand",
              data: hands,
            })
          );
          handRaised = false;
        }
        if (jsonMsg.data === "understanding"){
          histogram.fill(0);
          sendToAll(
            JSON.stringify({
              type: "histogram",
              data: histogram,
            })
          );
        }
        if (jsonMsg.data === "reactions"){
          globalEmotes.splice(0, globalEmotes.length);
          clientEmotes.clear();
          sendToAll(
            JSON.stringify({
              type: "emotes",
              data: globalEmotes,
            })
          );
        }
      }
    });
    connection.socket.on("close", () => {
      //const removeIndex = conns.indexOf(connection.socket);
      //conns.splice(removeIndex, 1);

      //what to do when a user disconnects
      if (handRaised) updateList(author);

      console.log(clientEmotes);
      for (const emote of Array.from(clientEmotes.keys())) {
        console.log("printong global emotes", globalEmotes);
        console.log("emote is ", emote);
        const changeIndex = globalEmotes.findIndex(
          (item) => item.name === emote
        );
        console.log("value of change index", changeIndex);
        globalEmotes[changeIndex] = {
          name: globalEmotes[changeIndex].name,
          count: globalEmotes[changeIndex].count - 1,
        };
      }

      updatewhoIsIn(author);

      updateHist(-1, louVote);
      [
        { type: "hand", data: hands },
        { type: "graph", data: histogram },
        { type: "emotes", data: topFiveEmotes() },
        {
          type: "name",
          data: Array.from(whoIsIn.values()),
        },
      ].map((x) => sendToAll(JSON.stringify(x)));
    });
  }
);

// Run the server!
// this is the port the server is listening for requests
app.listen(4000, function (err, address) {
  if (err) {
    app.log.error(err.message);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
