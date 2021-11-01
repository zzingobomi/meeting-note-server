import http from "http";
import https from "https";
import SocketIO from "socket.io";
import express from "express";

const app = express();

///
/// http 서버
///

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

wsServer.on("connection", (socket) => {
  socket.emit("sayhello", "hello world");

  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:4000`);
httpServer.listen(4000, handleListen);

///
/// https 서버
///
/*
const options = {
  key: fs.readFileSync("./keys/private.pem"),
  cert: fs.readFileSync("./keys/public.pem"),
};

const httpsServer = https.createServer(options, app);
const wsServer = SocketIO(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

wsServer.on("connection", (socket) => {
  socket.emit("sayhello", "hello world");

  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on https://localhost:4000`);
httpsServer.listen(4000, handleListen);
*/
