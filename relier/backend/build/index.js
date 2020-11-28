"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var fastify_websocket_1 = __importDefault(require("fastify-websocket"));
//step one, init fastify
var app = fastify_1.default({ logger: true });
// registering adds a plugin to our framework
// we want websocket!
app.register(fastify_websocket_1.default);
//mega monster global variable
//of ALL that clients!! o/
var conns = [];
var histogram = [0, 0, 0, 0, 0];
var whoIsIn = new Set();
function updatewhoIsIn(name) {
    if (whoIsIn.has(name))
        whoIsIn.delete(name);
    else
        whoIsIn.add(name);
    return whoIsIn;
}
//function updateHist ({newVote, prevVote}:{newVote : number, prevVote: number}) {
function updateHist(newVote, prevVote) {
    var tempHist = histogram;
    if (prevVote !== -1)
        tempHist.splice(prevVote - 1, 1, tempHist[prevVote - 1] - 1);
    if (newVote >= 0) {
        tempHist.splice(newVote - 1, 1, tempHist[newVote - 1] + 1);
    }
    histogram = tempHist;
    return histogram;
}
var hands = [];
//function updateList
function updateList(hand) {
    var index = hands.indexOf(hand);
    if (index === -1)
        hands.push(hand);
    else
        hands.splice(index, 1);
    return hands;
}
var globalEmotes = [];
var topFiveEmotes = function () {
    return globalEmotes
        .sort(function (x, y) { return y.count - x.count; })
        .slice(0, 5)
        .filter(function (_a) {
        var count = _a.count;
        return count > 0;
    });
};
var sendToAll = function (message) {
    return conns.forEach(function (con) {
        return con.socket.send(message);
    });
};
//registering routes
//if you send a get req to the root of the app,
//here is how we'll deal with it
app.get("/", function (request, reply) {
    reply
        .header("content-type", "text/html")
        .send("<!doctype html><html></html>");
});
app.get("/start-socket", { websocket: true }, function (connection, req) {
    //adds connection to the list of connections
    conns.push(connection);
    //anything defined here will be associated with the connection
    //this way we store some state info per user!
    //handler to broadcast message to all
    //handlers register event types to functions
    // we are handlign a particular event type, the message event
    var louVote;
    var handRaised;
    var clientEmotes = new Set();
    var author;
    [
        { type: "hand", data: hands },
        { type: "graph", data: histogram },
        { type: "emotes", data: topFiveEmotes() },
        { type: "name", data: whoIsIn },
    ].map(function (x) { return connection.socket.send(JSON.stringify(x)); });
    connection.socket.on("message", function (message) {
        //this is were we handle requests from the client
        //console.log(message);
        var jsonMsg = JSON.parse(message);
        console.log(JSON.stringify(jsonMsg, null, 2));
        if (jsonMsg.type === "chat")
            sendToAll(message);
        if (jsonMsg.type === "graph") {
            sendToAll(JSON.stringify({
                type: "graph",
                data: updateHist(jsonMsg.vote, jsonMsg.prevVote),
            }));
            louVote = jsonMsg.vote;
        }
        if (jsonMsg.type === "name") {
            author = jsonMsg.author;
            sendToAll(JSON.stringify({
                type: "name",
                data: updatewhoIsIn(jsonMsg.author),
            }));
        }
        if (jsonMsg.type === "hand") {
            var data = updateList(jsonMsg.author);
            sendToAll(JSON.stringify({
                type: "hand",
                data: data,
            }));
            handRaised = data.some(function (nameInList) { return nameInList === jsonMsg.author; });
        }
        if (jsonMsg.type === "emote") {
            //the index of the emoji count we are going to be updating
            var changeIndex = globalEmotes.findIndex(function (item) { return item.name === jsonMsg.name; });
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
            }
            else {
                globalEmotes[changeIndex] = {
                    name: globalEmotes[changeIndex].name,
                    count: globalEmotes[changeIndex].count - 1,
                };
                clientEmotes.delete(jsonMsg.name);
            }
            console.log("all emotes", globalEmotes);
            console.log("top 5 emoji ", topFiveEmotes());
            sendToAll(JSON.stringify({
                type: "emotes",
                data: topFiveEmotes(),
            }));
        }
        if (jsonMsg.type === "clear") {
            if (jsonMsg.data === "hands") {
                hands.splice(0, hands.length);
                sendToAll(JSON.stringify({
                    type: "hand",
                    data: hands,
                }));
            }
            handRaised = false;
        }
    });
    connection.socket.on("disconnect", function () {
        //what to do when a user disconnects
        if (handRaised)
            updateList(author);
        var _loop_1 = function (emotes) {
            var changeIndex = globalEmotes.findIndex(function (item) { return item.name === emotes; });
            globalEmotes[changeIndex] = {
                name: globalEmotes[changeIndex].name,
                count: globalEmotes[changeIndex].count - 1,
            };
        };
        for (var emotes in clientEmotes.keys()) {
            _loop_1(emotes);
        }
        updatewhoIsIn(author);
        updateHist(-1, louVote);
    });
});
// Run the server!
// this is the port the server is listening for requests
app.listen(4000, function (err, address) {
    if (err) {
        app.log.error(err.message);
        process.exit(1);
    }
    app.log.info("server listening on " + address);
});
