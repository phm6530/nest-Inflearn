export type PostModel = {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
};

export type postBody = { author: string; title: string; content: string };
