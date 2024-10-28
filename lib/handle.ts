export type Handle = () => {
  html?: {
    lang?: string;
  },
  body?: {
    className?: string;
  }
};