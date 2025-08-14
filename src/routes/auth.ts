import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import type { User } from "../types/index.js";

const users = new Map<string, User>();
const tokens = new Map<string, string>(); // token -> userId
let idCounter = 1;

const createToken = (userId: string): string => {
  // naive token for demo only
  return `token_${userId}_${Date.now()}`;
};

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (token && tokens.has(token)) {
    // @ts-expect-error attach userId for downstream
    req.userId = tokens.get(token);
  }
  next();
};

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  const { username, email } = req.body ?? {};
  if (!username || !email) {
    return res.status(400).json({ error: "username and email are required" });
  }
  const userId = `u${idCounter++}`;
  const user: User = { id: userId, username, email };
  users.set(userId, user);
  const token = createToken(userId);
  tokens.set(token, userId);
  res.status(201).json({ user, token });
});

router.post("/login", (req: Request, res: Response) => {
  const { username } = req.body ?? {};
  if (!username) return res.status(400).json({ error: "username is required" });
  // find or create for demo simplicity
  let existing = Array.from(users.values()).find((u) => u.username === username);
  if (!existing) {
    const userId = `u${idCounter++}`;
    existing = { id: userId, username };
    users.set(userId, existing);
  }
  const token = createToken(existing.id);
  tokens.set(token, existing.id);
  res.json({ token, user: existing });
});

router.post("/logout", authMiddleware, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (token) tokens.delete(token);
  res.status(204).send();
});

router.get("/me", authMiddleware, (req: Request, res: Response) => {
  // @ts-expect-error set by auth middleware
  const userId: string | undefined = req.userId;
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  const user = users.get(userId);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  res.json({ user });
});

export default router;


