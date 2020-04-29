// src/server.ts
import * as express from "express";
import * as socketio from "socket.io";
import * as http from 'http';
import * as Mongoose from 'mongoose';
import { handleConnect, handleReceiveMessage } from "./controller/controller";

Mongoose.connect('mongodb://localhost:27017/tags', {useNewUrlParser: true, useUnifiedTopology: true});


const app = express();
app.set("port", process.env.PORT || 3000);

app.use((req: express.Request, res, ) => {
  const headers = {
    "Access-Control-Allow-Origin": "http://localhost:8080",
    "Vary": "Origin",

    // Access-Control-Max-Age
    "Access-Control-Max-Age": "3600",

    // Access-Control-Allow-Credentials
    "Access-Control-Allow-Credentials": "true"
  };
  res.writeHead(200, headers);
  res.end();
});

const io = socketio(http).listen(3000);

// simple '/' endpoint sending a Hello World
// response
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("hello world");
});

io.sockets.on('connection', (socket) => {
  console.log("usr connected");
  handleConnect(socket);
  socket.on('message', (msg) => handleReceiveMessage(msg, socket));
});