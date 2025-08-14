import { Router } from "express";
import type { Request, Response } from "express";
import { posts, comments } from "../data/seed.js";

const router = Router();

// List posts (supports ?sort=hot|new|top - basic placeholder)
router.get("/", (req: Request, res: Response) => {
  const sort = String(req.query.sort || "hot");
  let sorted = [...posts];
  if (sort === "new") {
    sorted = sorted.reverse();
  } else if (sort === "top") {
    sorted = sorted.sort((a, b) => b.upvotes - a.upvotes);
  } else {
    // hot: naive sort by comments then upvotes
    sorted = sorted.sort((a, b) => b.comments - a.comments || b.upvotes - a.upvotes);
  }
  res.json(sorted);
});

// Post detail
router.get("/:id", (req: Request, res: Response) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// Comments for a post
router.get("/:id/comments", (req: Request, res: Response) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  const postComments = comments.filter((c) => c.postId === post.id);
  res.json(postComments);
});

// Vote on a post (in-memory)
// body: { direction: 'up' | 'down' | 'none' }
router.post("/:id/vote", (req: Request, res: Response) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  const direction: string = (req.body?.direction ?? "none").toString();
  if (direction === "up") {
    post.upvotes += 1;
  } else if (direction === "down") {
    post.upvotes = Math.max(0, post.upvotes - 1);
  } else if (direction !== "none") {
    return res.status(400).json({ error: "direction must be 'up', 'down', or 'none'" });
  }
  res.json(post);
});

export default router;


