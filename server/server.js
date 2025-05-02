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
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
  },
});

// io.of(/^\/yjs\|.*/).use(async (socket, next) => {
//   const token = socket.handshake.auth?.token;
//   const documentId = socket.nsp.name.split("|")[1];
//   const authenticated = await authenticate(token, documentId);
//   console.log("authenticated: ", authenticated);
//   if (authenticated) {
//     const document = await httpClient.query(api.documents.getDocumentById, {
//       documentId,
//     });

//     if (!document.organizationId) {
//       console.log("Unauthorized");
//       socket.disconnect(true);
//       next(new Error("Unauthorized"));
//     } else if (document.organizationId !== authenticated.organization_id) {
//       console.log("Unauthorized");
//       socket.disconnect(true);
//       next(new Error("Unauthorized"));
//     } else {
//       console.log("Authorized");
//       return next();
//     }
//   }
//   console.log("Unauthorized");
//   next(new Error("Unauthorized"));
//   socket.disconnect(true);
// });

const ySocketIO = new YSocketIO(io, {
  ydocOptions: { gc: true },
  authenticate: async (handshake) => {
    return await authenticateToken(
      handshake.auth.token,
      handshake.auth.documentId
    );
  },
});

ySocketIO.initialize();

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`✅ Yjs server running at http://localhost:${PORT}`);
});

// async function authenticateToken(token) {
//   try {
//     // Verify the token using Clerk's SDK
//     const session = await clerk.verifyToken(token);
//     console.log(session);
//     return session;
//   } catch (error) {
//     return false;
//   }
// }

async function authenticateToken(token, documentId) {
  try {
    // Verify the token using Clerk's SDK
    const session = await clerk.verifyToken(token);
    const document = await httpClient.query(api.documents.getDocumentById, {
      documentId,
    });

    if (!document.organizationId) {
      console.log("Unauthorized");
      return false;
    } else if (document.organizationId !== session.organization_id) {
      console.log("Unauthorized");
      return false;
    } else {
      console.log("Authorized");
      return true;
    }
  } catch (error) {
    console.log("Error", error);
    return false;
  }
}
