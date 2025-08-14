export type Post = {
  id: string;
  title: string;
  subreddit: string; // e.g. "r/aww"
  author: string; // e.g. "u/doglover42"
  time: string; // display string like "5h ago"
  upvotes: number;
  comments: number;
  image?: string;
  content?: string;
};

export type Comment = {
  id: string;
  postId: string;
  author: string; // e.g. "u/janedoe"
  content: string;
  time: string; // display string
  votes: number;
};

export type User = {
  id: string;
  username: string;
  email?: string;
};


