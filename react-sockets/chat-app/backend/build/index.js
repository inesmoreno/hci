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
//registering routes
//if you send a get req to the root of the app,
//here is how we'll deal with it
app.get('/', function (request, reply) {
    reply.send({ message: "hello world!" });
});
app.get('/start-socket', { websocket: true }, function (connection, req) {
    connection.socket.on('message', function (message) {
        // message === 'hi from client'
        connection.socket.send('hi from server');
    });
});
// Run the server!
app.listen(3000, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info("server listening on " + address);
});
