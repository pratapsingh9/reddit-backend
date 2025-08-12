import express from "express";
import type { Request, Response } from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const PORT = 8000;

const server = http.createServer(app);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    const typeMessage: any = JSON.stringify(message);
    if (typeMessage.type == "join") {
      console.log("A new user has joined the chat");
      ws.send("Welcome to the chat!");
      return;
    } else {
      if (typeMessage.type == "send") {
        console.log(`Message received: ${message}`);
        ws.send(`Message received: ${message}`);
        return;
      }
    }
    console.log(`Received: ${message}`);
    ws.send(`You said: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
