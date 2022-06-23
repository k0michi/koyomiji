import * as Nano from "nano-jsx";
import { LogItem } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: LogItem[];
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
        {props.items.map(i => <h2><a href={`/log/${i.id}`}><span class="log-id">#{i.id}</span> {i.title}</a></h2>)}
      </Frame>
    </>
  );
}