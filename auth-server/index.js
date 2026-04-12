import "dotenv/config";
import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

const PORT = process.env.AUTH_PORT || 3001;
const betterAuthHandler = toNodeHandler(auth);

const server = createServer((req, res) => {
  // Health check
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy", service: "auth-server" }));
    return;
  }

  // All /auth/* requests handled by better-auth
  if (req.url?.startsWith("/auth")) {
    return betterAuthHandler(req, res);
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
