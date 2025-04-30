import express from "express";
import http from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.of(/^\/yjs\|.*/).use((socket, next) => {
  const token = socket.handshake.auth?.token;
  console.log("🪪 Token received from frontend:", token);
  console.log("⚙️ Full handshake.auth:", socket.handshake.auth);
  return next();
  if (token === "valid-token") {
    return next();
  }
  next(new Error("Unauthorized"));
});

const ySocketIO = new YSocketIO(io);

ySocketIO.initialize();

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`✅ Yjs server running at http://localhost:${PORT}`);
});
