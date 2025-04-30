import express from "express";
import http from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import { Clerk } from "@clerk/clerk-sdk-node";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.of(/^\/yjs\|.*/).use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  const authenticated = await authenticate(token);
  console.log("authenticated: ", authenticated);
  if (authenticated) {
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

async function authenticate(token) {
  try {
    // Verify the token using Clerk's SDK
    const session = await clerk.verifyToken(token);
    return true;
  } catch (error) {
    return false;
  }
}
