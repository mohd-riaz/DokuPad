import express from "express";
import http from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import { Clerk } from "@clerk/clerk-sdk-node";
import * as dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
const httpClient = new ConvexHttpClient(process.env.CONVEX_URL);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.of(/^\/yjs\|.*/).use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  const documentId = socket.nsp.name.split("|")[1];
  const authenticated = await authenticate(token, documentId);
  console.log("authenticated: ", authenticated);
  if (authenticated) {
    const document = httpClient
      .query(api.documents.getDocumentById, { documentId })
      .then(console.log);

    if (!document.organizationId) {
      next(new Error("Unauthorized"));
      console.log("Unauthorized");
      socket.disconnect();
    }

    if (document.organizationId !== token.organizationId) {
      next(new Error("Unauthorized"));
      console.log("Unauthorized");
      socket.disconnect();
    }

    return next();
  }
  next(new Error("Unauthorized"));
  console.log("Unauthorized");
  socket.disconnect();
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
    console.log(session);

    return true;
  } catch (error) {
    return false;
  }
}
