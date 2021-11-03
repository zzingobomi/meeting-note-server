import http from "http";
import https from "https";
import { Server } from "socket.io";
import express from "express";
import fs from "fs";

const app = express();

let users = {};
let socketToRoom = {};
const maximum = process.env.MAXIMUM || 4;

///
/// http
///

app.get("/", (req, res) => {
  res.send("hello meeting note server");
});

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

wsServer.on("connection", (socket) => {
  socket.emit("sayhello", "hello world");

  socket.on("join_room", (data) => {
    if (users[data.room]) {
      const length = users[data.room].length;
      if (length === maximum) {
        socket.to(socket.id).emit("room_full");
        return;
      }
      users[data.room].push({ id: socket.id, nickName: data.nickName });
    } else {
      users[data.room] = [{ id: socket.id, nickName: data.nickName }];
    }
    socketToRoom[socket.id] = data.room;

    socket.join(data.room);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    const usersInThisRoom = users[data.room].filter(
      (user) => user.id !== socket.id
    );

    console.log(usersInThisRoom);

    wsServer.sockets.to(socket.id).emit("all_users", usersInThisRoom);
  });

  socket.on("offer", (data) => {
    //console.log(data.sdp);
    socket.to(data.offerReceiveID).emit("getOffer", {
      sdp: data.sdp,
      offerSendID: data.offerSendID,
      offerSendNickName: data.offerSendNickName,
    });
  });

  socket.on("answer", (data) => {
    //console.log(data.sdp);
    socket
      .to(data.answerReceiveID)
      .emit("getAnswer", { sdp: data.sdp, answerSendID: data.answerSendID });
  });

  socket.on("candidate", (data) => {
    //console.log(data.candidate);
    socket.to(data.candidateReceiveID).emit("getCandidate", {
      candidate: data.candidate,
      candidateSendID: data.candidateSendID,
    });
  });

  socket.on("disconnect", () => {
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }
    socket.to(roomID).emit("user_exit", { id: socket.id });
    console.log(users);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:4000`);
httpServer.listen(4000, handleListen);

///
/// https
///
/*
app.get("/", (req, res) => {
  res.send("hello meeting note server");
});

const options = {
  key: fs.readFileSync("/volume1/meeting-note-server/keys/privkey.pem"),
  cert: fs.readFileSync("/volume1/meeting-note-server/keys/cert.pem"),
};

const httpsServer = https.createServer(options, app);
const wsServer = new Server(httpsServer, {
  cors: {
    origin: "https://zzingobomi.github.io",
    methods: ["GET", "PUT", "POST"],
    credentials: true
  },
});

wsServer.on("connection", (socket) => {
  socket.emit("sayhello", "hello world");

  socket.on("join_room", (data) => {
    if (users[data.room]) {
      const length = users[data.room].length;
      if (length === maximum) {
        socket.to(socket.id).emit("room_full");
        return;
      }
      users[data.room].push({ id: socket.id, nickName: data.nickName });
    } else {
      users[data.room] = [{ id: socket.id, nickName: data.nickName }];
    }
    socketToRoom[socket.id] = data.room;

    socket.join(data.room);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    const usersInThisRoom = users[data.room].filter(
      (user) => user.id !== socket.id
    );

    console.log(usersInThisRoom);

    wsServer.sockets.to(socket.id).emit("all_users", usersInThisRoom);
  });

  socket.on("offer", (data) => {
    //console.log(data.sdp);
    socket.to(data.offerReceiveID).emit("getOffer", {
      sdp: data.sdp,
      offerSendID: data.offerSendID,
      offerSendNickName: data.offerSendNickName,
    });
  });

  socket.on("answer", (data) => {
    //console.log(data.sdp);
    socket
      .to(data.answerReceiveID)
      .emit("getAnswer", { sdp: data.sdp, answerSendID: data.answerSendID });
  });

  socket.on("candidate", (data) => {
    //console.log(data.candidate);
    socket.to(data.candidateReceiveID).emit("getCandidate", {
      candidate: data.candidate,
      candidateSendID: data.candidateSendID,
    });
  });

  socket.on("disconnect", () => {
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }
    socket.to(roomID).emit("user_exit", { id: socket.id });
    console.log(users);
  });
});

const handleListen = () => console.log(`Listening on https://localhost:4000`);
httpsServer.listen(4000, handleListen);
*/
