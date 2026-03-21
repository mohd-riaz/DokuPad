import express from "express";
import http from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import { createClerkClient } from "@clerk/express";
import { verifyToken } from "@clerk/backend";
import * as dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import * as Y from "yjs";

dotenv.config({ path: ".env.local" });

const app = express();
const server = http.createServer(app);

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const httpClient = new ConvexHttpClient(
  process.env.CONVEX_URL,
);

if (process.env.CONVEX_DEPLOY_KEY) {
  httpClient.setAdminAuth(process.env.CONVEX_DEPLOY_KEY);
}

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const ySocketIO = new YSocketIO(io, {
  ydocOptions: { gc: true },
  authenticate: async (handshake) => {
    return await authenticateToken(
      handshake.auth.token,
      handshake.auth.documentId,
    );
  },
});

ySocketIO.initialize();

ySocketIO.on("document-loaded", async (doc) => {
  try {
    const existing = await httpClient.query(api.documents.getDocumentById, {
      documentId: doc.name,
    });

    if (existing?.initialContent) {
      const update = new Uint8Array(existing.initialContent);
      if (update.length === 0) {
        console.log(`Empty data for ${doc.name}`);
        return;
      }
      Y.applyUpdate(doc, update);
      console.log(`🔄 Loaded ${doc.name} from Convex`);
    } else {
      console.log(`🆕 No existing data for ${doc.name}`);
    }
  } catch {
    console.log(`Document not found.`);
  }
});

async function saveContent(doc) {
  try {
    const update = Y.encodeStateAsUpdate(doc);

    await httpClient.mutation(api.documents.saveDocumentById, {
      id: doc.name,
      initialContent: update.buffer,
    });

    console.log(`💾 Saved ${doc.name} to Convex`);
  } catch {
    console.log("Error saving document to convex");
  }
}

ySocketIO.on("document-destroy", async (doc) => {
  console.log("doc destroyed");
  await saveContent(doc);
});
ySocketIO.on("all-document-connections-closed", async (doc) => {
  console.log("all docs closed");
  doc.destroy();
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`✅ Yjs server running at http://localhost:${PORT}`);
});

async function authenticateToken(token, documentId) {
  try {
    // Verify the token using Clerk's SDK
    const session = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const document = await httpClient.query(api.documents.getDocumentById, {
      documentId,
    });

    if (!session.sub) {
      console.log("Unauthorized");
      return false;
    }

    const memberships = await clerk.users.getOrganizationMembershipList({
      userId: session.sub,
    });

    const isMember =
      memberships &&
      memberships.data.some((m) => m.organization.id === document.organizationId);

    if (!document.organizationId) {
      console.log("Unauthorized");
      return false;
    } else if (!isMember) {
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
