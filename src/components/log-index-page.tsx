import * as React from 'react';
import { Helmet } from 'react-helmet';
import dateToString from '../date-format.js';
import { PostHead } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: PostHead[];
}

function join(elements: JSX.Element[]) {
  const newElements = [];

  for (let i = 0; i < elements.length; i++) {
    newElements.push(elements[i]);

    if (i < elements.length - 1) {
      // FIXME
      newElements.push(<hr />);
    }
  }

  return newElements;
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
      {join(props.items.map(i =>
        <div className="summary" key={i.id}>
          <h2><a href={`/log/${i.id}`}>{i.title}</a></h2>
          <div className="meta">
            <div className="number">#{i.id}</div>
            <div className="date"><div className="calender-icon"></div><div>{dateToString(new Date(i.created))}</div></div>
          </div>
          <p>{i.description}</p>
        </div>
      ))}
    </>
  );
}