import express from "express";
import type { Request, Response, NextFunction } from "express";
import { WebSocketServer } from "ws";
import http from "http";
import postsRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = 8000;

// Basic CORS (no dependency) and JSON body parsing
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());

// Mount routers
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);

// HTTP routes
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Discourse API is up" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});


// Basic auth placeholders (no real persistence/security)
app.post("/api/auth/register", (req: Request, res: Response) => {
  const { username, email } = req.body ?? {};
  if (!username || !email) {
    return res.status(400).json({ error: "username and email are required" });
  }
  res.status(201).json({
    user: { id: "u1", username, email },
    token: "demo-token",
  });
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { username } = req.body ?? {};
  if (!username) return res.status(400).json({ error: "username is required" });
  res.json({ token: "demo-token", user: { id: "u1", username } });
});

// WebSocket server for lightweight realtime demo
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (data) => {
    let payload: any;
    try {
      payload = JSON.parse(String(data));
    } catch (_) {
      payload = { type: "raw", data: String(data) };
    }
    if (payload.type === "join") {
      console.log("A new user has joined the chat");
      ws.send(JSON.stringify({ type: "system", message: "Welcome to the chat!" }));
      return;
    }
    if (payload.type === "send") {
      console.log(`Message received: ${payload.message}`);
      ws.send(JSON.stringify({ type: "echo", message: payload.message }));
      return;
    }
    console.log(`Received: ${String(data)}`);
    ws.send(JSON.stringify({ type: "echo", message: String(data) }));
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
