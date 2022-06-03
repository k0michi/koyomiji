import * as Nano from "nano-jsx";
import { BlogItem } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: BlogItem[];
}

export default function BlogIndexPage(props: Props) {
  const url = `https://koyomiji.com/blog/`;
  props.items.sort((a, b) => b.id.localeCompare(a.id));

  return (
    <>
      <Nano.Helmet>
        <title>雑記帳 | 曆路堂</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="雑記帳" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Nano.Helmet>
      <Frame>
        {props.items.map(i => <h2><a href={`/blog/${i.id}/`}><span class="blog-id">#{i.id}</span> {i.title}</a></h2>)}
      </Frame>
    </>
  );
}