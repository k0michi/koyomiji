export interface PostHead {
  title: string;
  created: string;
  description: string;
  category?: string;
  id: string;
}

export interface Post {
  head: PostHead;
  body: Element;
}