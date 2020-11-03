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
var sendToAll = function (message) {
    return conns.forEach(function (con) { return con.socket.send(message); });
};
//registering routes
//if you send a get req to the root of the app,
//here is how we'll deal with it
app.get('/', function (request, reply) {
    reply.header('content-type', 'text/html').send('<!doctype html><html></html>');
});
app.get('/start-socket', { websocket: true }, function (connection, req) {
    //adds connection to the list of connections
    conns.push(connection);
    //handler to broadcast message to all
    //handlers register event types to functions
    // we are handlign a particular event type, the message event
    connection.socket.on('message', function (message) {
        // message === 'hi from client'
        console.log(message);
        sendToAll(message);
    });
});
// Run the server!
// this is the port the server is listening for requests
app.listen(4000, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info("server listening on " + address);
});
