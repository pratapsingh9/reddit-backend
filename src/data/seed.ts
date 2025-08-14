import type { Post, Comment, Community } from "../types/index.js";

export const posts: Post[] = [
  {
    id: "1",
    title: "Just adopted this little guy today! Meet Max!",
    subreddit: "r/aww",
    author: "u/doglover42",
    time: "5h ago",
    upvotes: 12300,
    comments: 842,
    image: "https://i.redd.it/9bf67ygj7a0d1.jpeg",
    content:
      "After months of waiting, I finally got to bring this little guy home. Meet Max!",
  },
  {
    id: "2",
    title:
      "TIL that honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
    subreddit: "r/todayilearned",
    author: "u/factfinder",
    time: "8h ago",
    upvotes: 24700,
    comments: 1200,
  },
  {
    id: "3",
    title: "My homemade pizza from last night",
    subreddit: "r/food",
    author: "u/pizzalover",
    time: "3h ago",
    upvotes: 5600,
    comments: 312,
    image: "https://i.redd.it/homemade-pizza-xyz.jpg",
    content: "Tried a new dough recipe and it came out so good!",
  },
];

export const comments: Comment[] = [
  {
    id: "c1",
    postId: "1",
    author: "u/dogenthusiast",
    content: "So adorable! What breed is he?",
    time: "3h",
    votes: 42,
  },
  {
    id: "c2",
    postId: "1",
    author: "u/pupfan",
    content: "Congrats! Max is super cute.",
    time: "2h",
    votes: 15,
  },
];

export const communities: Community[] = [
  { id: "c1", name: "r/aww", members: 5230000 },
  { id: "c2", name: "r/todayilearned", members: 33000000 },
  { id: "c3", name: "r/food", members: 24000000 },
];

export const notifications = [
  { id: 'n1', title: 'Welcome to the app', body: 'Thanks for joining!', time: '1d' },
  { id: 'n2', title: 'New comment', body: 'Someone commented on your post', time: '5h' },
];


