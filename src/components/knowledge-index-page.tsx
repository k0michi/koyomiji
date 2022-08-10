import * as React from 'react';
import { Helmet } from 'react-helmet';
import { categoryNames } from "../category.js";
import { PostHead } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: PostHead[];
}

function getCategory(p: PostHead) {
  return p.path[1];
}

function getID(p: PostHead) {
  return p.path[2];
}

export default function KnowledgeIndexPage(props: Props) {
  const url = `https://koyomiji.com/knowledge`;

  props.items.sort((a, b) => {
    if (getCategory(a) == getCategory(b)) {
      return getID(a).localeCompare(getID(b));
    } else {
      return getCategory(a).localeCompare(getCategory(b));
    }
  });

  const map: { [key: string]: PostHead[]; } = {};

  for (const item of props.items) {
    if (map[getCategory(item)] == null) {
      map[getCategory(item)] = [];
    }

    map[getCategory(item)].push(item);
  }

  return (
    <>
      <Helmet>
        <title>Knowledge | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Knowledge" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      {Object.entries(map).map(([k, v]) =>
        <div className="category" key={k}>
          <h2>{categoryNames[k]}</h2>
          <ul>
            {v.map(i => <li key={`${getCategory(i)}/${getID(i)}`}><a href={`/knowledge/${getCategory(i)}/${getID(i)}`}>{i.title}</a></li>)}
          </ul>
        </div>
      )}
    </>
  );
}