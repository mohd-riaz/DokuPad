import express from "express";
import http from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import { Clerk, hasValidSignature } from "@clerk/clerk-sdk-node";
import * as dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import * as Y from "yjs";

dotenv.config();

const app = express();
const server = http.createServer(app);

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
const httpClient = new ConvexHttpClient(process.env.CONVEX_URL);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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

ySocketIO.on("document-loaded", async (doc) => {
  console.log(doc.name);

  const existing = await httpClient.query(api.documents.getDocumentById, {
    documentId: doc.name,
  });

  if (existing?.initialContent) {
    const update = Buffer.from(existing.initialContent || "", "base64");
    Y.applyUpdate(doc, update);
    console.log(`🔄 Loaded ${doc.name} from Convex`);
  } else {
    console.log(`🆕 No existing data for ${doc.name}`);
  }
});

async function saveContent(doc) {
  const update = Y.encodeStateAsUpdate(doc);
  const base64 = Buffer.from(update).toString("base64");
  console.log(base64);

  await httpClient.mutation(api.documents.saveDocumentById, {
    id: doc.name,
    initialContent: base64,
  });

  console.log(`💾 Saved ${doc.name} to Convex`);
}

ySocketIO.on("document-destroy", saveContent);
ySocketIO.on("all-document-connections-closed", async (doc) => {
  await saveContent(doc);
  ySocketIO.destroy(doc);
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`✅ Yjs server running at http://localhost:${PORT}`);
});

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
