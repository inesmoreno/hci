import fasty from 'fastify';
import websocket, { SocketStream } from 'fastify-websocket';

//step one, init fastify 
const app = fasty({logger: true});
// registering adds a plugin to our framework
// we want websocket! 
app.register(websocket);

//mega monster global variable
//of ALL that clients!! o/

const conns : SocketStream[] = [];

const sendToAll = (message: string) => 
  conns.forEach((con: SocketStream) => con.socket.send(message));
//registering routes
//if you send a get req to the root of the app,
//here is how we'll deal with it
app.get('/', (request, reply) => {
    reply.header('content-type', 'text/html').send('<!doctype html><html></html>')
})

app.get('/start-socket', { websocket: true }, (connection, req) => {
  //adds connection to the list of connections
  conns.push(connection);
  //handler to broadcast message to all
  //handlers register event types to functions
  // we are handlign a particular event type, the message event
  connection.socket.on('message', (message: string) => {
    // message === 'hi from client'
    console.log(message);
    sendToAll(message);
  })
})
// Run the server!
app.listen(4000, function (err, address) {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
  })
