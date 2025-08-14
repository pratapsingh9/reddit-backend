import { Router } from "express";
import type { Request, Response } from "express";
import { communities, notifications } from "../data/seed.js";

const router = Router();

// List communities
router.get("/", (_req: Request, res: Response) => {
  res.json(communities);
});

// Create community (in-memory)
router.post("/", (req: Request, res: Response) => {
  const { name } = req.body ?? {};
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
  }
  const norm = name.startsWith("r/") ? name : `r/${name}`;
  const exists = communities.find((c) => c.name.toLowerCase() === norm.toLowerCase());
  if (exists) return res.status(409).json({ error: "community already exists" });

  const created = { id: `c${Date.now()}`, name: norm, members: 1 };
  communities.push(created);
  res.status(201).json(created);
});

export default router;


