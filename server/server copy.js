// const http = require("http");
// const WebSocket = require("ws");
// const { setupWSConnection } = require("y-websocket/bin/utils");

// require("dotenv").config();

// const server = http.createServer();
// const wss = new WebSocket.Server({ server });

// wss.on("connection", async (conn, req) => {
//   setupWSConnection(conn, req);
// });

// server.listen(1234, () => {
//   console.log("✅ WebSocket server running on ws://localhost:1234");
// });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Change as needed
    methods: ["GET", "POST"],
  },
});

// io.of(/^\/yjs\|.*/).on("connection", (socket) => {
//   const token = socket.handshake.auth?.token;
//   console.log(token);
//   if (token !== "valid-token") {
//     socket.emit("auth-denied", "You are not authorized to edit this document.");
//     socket.disconnect(true);
//   } else {
//     socket.emit(
//       "auth-granted",
//       "You are not authorized to edit this document."
//     );
//   }
// });

// io.of(/^\/yjs\|.*/).on("connection", (socket) => {
//   const token = socket.handshake.auth?.token;
//   if (token !== "valid-token") {
//     socket.emit("auth-denied", "Unauthorized");
//     socket.disconnect(true); // force disconnect
//   }
// });

io.of(/^\/yjs\|.*/).use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (token !== "valid-token") {
    return next(new Error("unauthorized"));
  }
  next();
});

const configuration = {
  // Optionally, set here the authentication validation callback (by default server accepts all connections)
  // For example: if client sent a token or other data, you can get it from auth object of
  //              socket.io handshake
  authenticate: (handshake) => {
    console.log(handshake.auth.token);
    return false;
  }, // Example: (handshake) => handshake.auth.token === 'valid-token')
  // Optionally, enable LevelDB persistence by setting the directory where you want to store the database (by default the LevelDB persistence is disabled)
  levelPersistenceDir: undefined,
  // Enable/Disable garbage collection (by default the garbage collection is enabled)
  gcEnabled: true,
};

// Initialize Yjs WebSocket integration using y-socket.io
const ySocketIO = new YSocketIO(io, configuration);
ySocketIO.initialize();

// Start server
const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
