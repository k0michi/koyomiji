import * as React from 'react';
import { Helmet } from 'react-helmet';
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
      <Helmet>
        <title>Logs | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Logs" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      {props.items.map(i =>
        <>
          <h2><span className="log-id">#{i.id}</span> <a href={`/log/${i.id}`}>{i.title}</a></h2>
          <p>{i.description}</p>
        </>
      )}
    </>
  );
}