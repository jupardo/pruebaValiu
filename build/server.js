"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
var express = require("express");
var socketio = require("socket.io");
var http = require("http");
var Mongoose = require("mongoose");
var controller_1 = require("./controller/controller");
Mongoose.connect('mongodb://localhost:27017/tags', { useNewUrlParser: true, useUnifiedTopology: true });
var app = express();
app.set("port", process.env.PORT || 3000);
app.use(function (req, res) {
    var headers = {
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
var io = socketio(http).listen(3000);
// simple '/' endpoint sending a Hello World
// response
app.get("/", function (req, res) {
    res.send("hello world");
});
io.sockets.on('connection', function (socket) {
    console.log("usr connected");
    controller_1.handleConnect(socket);
    socket.on('message', function (msg) { return controller_1.handleReceiveMessage(msg, socket); });
});
