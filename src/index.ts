import express from "express";
import type { Request, Response, NextFunction } from "express";
import { WebSocketServer } from "ws";
import http from "http";
import postsRouter from "./routes/posts.js";
import communitiesRouter from "./routes/communities.js";
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
app.use("/api/communities", communitiesRouter);
app.use("/api/auth", authRouter);

// HTTP routes
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Discourse API is up" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// simple notifications endpoint
app.get("/api/notifications", (_req: Request, res: Response) => {
  import("./data/seed.js").then(({ notifications }) => {
    res.json(notifications);
  });
});

// Messaging endpoints
app.get("/api/messages/conversations", (_req: Request, res: Response) => {
  // Mock conversations data
  const conversations = [
    {
      id: "1",
      participants: ["u/you", "u/johndoe"],
      lastMessage: "Hey, how are you doing?",
      lastMessageTime: "2m ago",
      unreadCount: 2,
    },
    {
      id: "2",
      participants: ["u/you", "u/janesmith"],
      lastMessage: "Thanks for the help!",
      lastMessageTime: "1h ago",
      unreadCount: 0,
    },
    {
      id: "3",
      participants: ["u/you", "u/mikebrown"],
      lastMessage: "Did you see the new post?",
      lastMessageTime: "3h ago",
      unreadCount: 1,
    },
  ];
  res.json(conversations);
});

app.get("/api/messages/conversations/:id", (req: Request, res: Response) => {
  const conversationId = req.params.id;
  // Mock messages data
  const messages = [
    {
      id: "1",
      conversationId,
      sender: "u/johndoe",
      content: "Hey, how are you doing?",
      timestamp: "2:30 PM",
      isRead: false,
    },
    {
      id: "2",
      conversationId,
      sender: "u/you",
      content: "I'm doing great! How about you?",
      timestamp: "2:31 PM",
      isRead: true,
    },
    {
      id: "3",
      conversationId,
      sender: "u/johndoe",
      content: "Pretty good! Just wanted to check in.",
      timestamp: "2:32 PM",
      isRead: false,
    },
  ];
  res.json(messages);
});

app.post("/api/messages/conversations/:id/messages", (req: Request, res: Response) => {
  const { content } = req.body;
  const conversationId = req.params.id;
  
  if (!content) {
    return res.status(400).json({ error: "Message content is required" });
  }

  const newMessage = {
    id: Date.now().toString(),
    conversationId,
    sender: "u/you",
    content: String(content),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isRead: false,
  };

  res.status(201).json(newMessage);
});

// User profile endpoints
app.get("/api/users/profile", (_req: Request, res: Response) => {
  const profile = {
    id: "u1",
    username: "u/you",
    email: "you@example.com",
    bio: "Bio goes here. Say a little something about yourself.",
    joinDate: "2024",
    karma: 1234,
    avatar: "https://i.pravatar.cc/200",
  };
  res.json(profile);
});

app.put("/api/users/profile", (req: Request, res: Response) => {
  const { bio, displayName } = req.body;
  
  const updatedProfile = {
    id: "u1",
    username: displayName || "u/you",
    email: "you@example.com",
    bio: bio || "Bio goes here. Say a little something about yourself.",
    joinDate: "2024",
    karma: 1234,
    avatar: "https://i.pravatar.cc/200",
  };

  res.json(updatedProfile);
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

type ExtWebSocket = import("ws").WebSocket & { username?: string };

const clients = new Set<ExtWebSocket>();

function broadcastPresence() {
  const users = Array.from(clients)
    .map((c) => c.username || "Guest")
    .slice(0, 100);
  const payload = JSON.stringify({ type: "presence", online: clients.size, users });
  for (const client of clients) {
    try {
      client.send(payload);
    } catch {}
  }
}

wss.on("connection", (wsRaw) => {
  const ws = wsRaw as ExtWebSocket;
  clients.add(ws);
  ws.username = `Guest-${Math.floor(Math.random() * 1000)}`;
  ws.send(JSON.stringify({ type: "system", message: "Welcome to the chat!" }));
  broadcastPresence();

  ws.on("message", (data) => {
    let payload: any;
    try {
      payload = JSON.parse(String(data));
    } catch (_) {
      payload = { type: "raw", data: String(data) };
    }
    if (payload.type === "introduce" && payload.username) {
      ws.username = String(payload.username);
      broadcastPresence();
      return;
    }
    if (payload.type === "send") {
      // echo back for demo
      ws.send(JSON.stringify({ type: "echo", message: payload.message }));
      return;
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    broadcastPresence();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
