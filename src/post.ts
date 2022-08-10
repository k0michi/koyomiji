export interface PostHead {
  title: string;
  created: string;
  description: string;
  path: string[];
}

export interface Post {
  head: PostHead;
  body: Element;
}