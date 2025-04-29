const http = require("http");
const WebSocket = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req);
});

server.listen(1234, () => {
  console.log("✅ WebSocket server running on ws://localhost:1234");
});

// const http = require("http");
// const WebSocket = require("ws");
// const { setupWSConnection } = require("y-websocket/bin/utils");
// const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
// const { createConvexClient } = require("@convex-dev/client");

// const server = http.createServer();
// const wss = new WebSocket.Server({ server });

// // Convex client setup
// const convex = createConvexClient({
//   url: "https://your-convex-instance-url", // Replace with your Convex instance URL
//   auth: { key: "your-convex-auth-key" }, // Replace with your Convex API key
// });

// // Set up Clerk authentication middleware
// const clerkAuthMiddleware = ClerkExpressWithAuth({
//   apiKey: "your-clerk-api-key", // Replace with your Clerk API key
// });

// // Function to load data from Convex for a user
// const loadUserData = async (userId) => {
//   try {
//     // Use the same query defined in your Next.js app
//     const result = await convex.query("getUserData", { userId });
//     return result || {}; // Return empty object if no data found
//   } catch (error) {
//     console.error("Error loading user data:", error);
//     return {};
//   }
// };

// // Function to save data to Convex when a user disconnects
// const saveUserData = async (userId, data) => {
//   try {
//     // Use the same mutation defined in your Next.js app
//     await convex.mutation("saveUserData", { userId, data });
//   } catch (error) {
//     console.error("Error saving user data:", error);
//   }
// };

// wss.on("connection", (conn, req) => {
//   // Extract the Clerk authentication token from headers
//   const token = req.headers["authorization"];

//   if (!token) {
//     conn.close(4000, "No token provided");
//     return;
//   }

//   // Authenticate using Clerk
//   clerkAuthMiddleware(req, res, () => {
//     const userId = req.auth.userId; // Get user ID from Clerk's auth object

//     if (!userId) {
//       conn.close(4000, "Invalid token or user not found");
//       return;
//     }

//     // Load user data from Convex
//     loadUserData(userId).then((userData) => {
//       setupWSConnection(conn, req, {
//         docName: userId,
//         connectTimeout: 1000,
//         userData,
//       });
//     });

//     // Handle saving data when the user disconnects
//     conn.on("close", async () => {
//       const updatedData = {}; // Collect user data that needs to be saved
//       await saveUserData(userId, updatedData);
//     });
//   });
// });

// server.listen(1234, () => {
//   console.log("✅ WebSocket server running on ws://localhost:1234");
// });
