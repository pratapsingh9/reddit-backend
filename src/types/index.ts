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
  bio?: string;
  joinDate?: string;
  karma?: number;
  avatar?: string;
};

export type Community = {
  id: string;
  name: string; // e.g. "r/aww"
  members: number;
  description?: string;
  createdAt?: string;
};

export type Message = {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'comment' | 'upvote' | 'mention' | 'system';
  time: string;
  isRead: boolean;
  relatedId?: string; // post or comment id
};


