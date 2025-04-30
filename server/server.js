const http = require("http");
const WebSocket = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");

require("dotenv").config();

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", async (conn, req) => {
  setupWSConnection(conn, req);
});

server.listen(1234, () => {
  console.log("✅ WebSocket server running on ws://localhost:1234");
});
