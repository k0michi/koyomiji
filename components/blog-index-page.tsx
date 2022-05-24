import * as Nano from "nano-jsx";
import { BlogItem } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: BlogItem[];
}

export default function BlogIndexPage(props: Props) {
  props.items.sort((a, b) => b.id.localeCompare(a.id));

  return (
    <>
      <Nano.Helmet>
        <title>雑記帳 | 曆路堂</title>
      </Nano.Helmet>
      <Frame>
        {props.items.map(i => <h2><a href={`/blog/${i.id}/`}><span class="blog-id">#{i.id}</span> {i.title}</a></h2>)}
      </Frame>
    </>
  );
}