import fasty from "fastify";
import { Emote } from "./types"; 
import websocket, { SocketStream } from "fastify-websocket";

//step one, init fastify
const app = fasty({ logger: true });
// registering adds a plugin to our framework
// we want websocket!
app.register(websocket);

//mega monster global variable
//of ALL that clients!! o/

const conns: SocketStream[] = [];
var histogram: number[] = [0, 0, 0, 0, 0];

//function updateHist ({newVote, prevVote}:{newVote : number, prevVote: number}) {
function updateHist(newVote: number, prevVote: number) {
  const tempHist = histogram;
  if (prevVote !== -1)
    tempHist.splice(prevVote - 1, 1, tempHist[prevVote - 1] - 1);
  tempHist.splice(newVote - 1, 1, tempHist[newVote - 1] + 1);
  histogram = tempHist;
  return histogram;
}

var hands: string[] = [];
//function updateList
function updateList(hand: string) {
  var index = hands.indexOf(hand);
  if (index === -1) hands.push(hand);
  else hands.splice(index);
  return hands;
}

const globalEmotes = new Map<string, number>();
const topFiveEmotes = () => Array.from(globalEmotes.entries()).sort(([_1, x], [_2, y]) => x - y).slice(0, 5);

const sendToAll = (message: string) =>
  conns.forEach((con: SocketStream) => con.socket.send(message));
//registering routes
//if you send a get req to the root of the app,
//here is how we'll deal with it
app.get("/", (request, reply) => {
  reply
    .header("content-type", "text/html")
    .send("<!doctype html><html></html>");
});

app.get("/start-socket", { websocket: true }, (connection, req) => {
  //adds connection to the list of connections
  conns.push(connection);
  //anything defined here will be associated with the connection
  //this way we store some state info per user!
  const emojiVotes = new Set<string>();


  //handler to broadcast message to all
  //handlers register event types to functions
  // we are handlign a particular event type, the message event
  connection.socket.on("message", (message: string) => {
    //this is were we handle requests from the client
    
    console.log(message);
    const jsonMsg = JSON.parse(message);
    console.log(jsonMsg.type);
    if (jsonMsg.type === "chat") sendToAll(message);
    if (jsonMsg.type === "graph")
      sendToAll(
        JSON.stringify({
          type: "graph",
          data: updateHist(jsonMsg.vote, jsonMsg.prevVote)
        })
      );

    if (jsonMsg.type === "hand")
      sendToAll(
        JSON.stringify({
          type: "hand",
          data: updateList(jsonMsg.author)
        })
      );
    
    if(jsonMsg.type === "emote"){
      if(jsonMsg.direction === "up"){
        emojiVotes.add(jsonMsg.data);
        globalEmotes.set(jsonMsg.data, ((globalEmotes.get(jsonMsg.data) ||0) +1));
      }
      else{
        emojiVotes.delete(jsonMsg.data);

        globalEmotes.set(jsonMsg.data, ((globalEmotes.get(jsonMsg.data) ||0) -1));
      }
      sendToAll(JSON.stringify({
        type: "emotes",
        data: topFiveEmotes(),
      }));
      }
  });

});

// Run the server!
// this is the port the server is listening for requests
app.listen(4000, function(err, address) {
  if (err) {
    app.log.error(err.message);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
