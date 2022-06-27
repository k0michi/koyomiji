import * as Nano from "nano-jsx";
import { PostHead } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: PostHead[];
}

export default function LogIndexPage(props: Props) {
  const url = `https://koyomiji.com/log`;
  props.items.sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));

  return (
    <>
      <Nano.Helmet>
        <title>雑記帳 | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="雑記帳" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Nano.Helmet>
      <Frame>
        {props.items.map(i => <h2><span class="log-id">#{i.id}</span> <a href={`/log/${i.id}`}>{i.title}</a></h2>)}
      </Frame>
    </>
  );
}