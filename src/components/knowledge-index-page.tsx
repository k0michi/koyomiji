import * as Nano from "nano-jsx";
import { categoryNames } from "../category.js";
import { KnowledgeItem } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: KnowledgeItem[];
}

export default function KnowledgeIndexPage(props: Props) {
  const url = `https://koyomiji.com/knowledge`;

  props.items.sort((a, b) => {
    if (a.category == b.category) {
      return a.id.localeCompare(b.id);
    } else {
      return a.category.localeCompare(b.category);
    }
  });

  const map: { [key: string]: KnowledgeItem[]; } = {};

  for (const item of props.items) {
    if (map[item.category] == null) {
      map[item.category] = [];
    }

    map[item.category].push(item);
  }

  return (
    <>
      <Nano.Helmet>
        <title>備忘録 | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="備忘録" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Nano.Helmet>
      <Frame>
        {Object.entries(map).map(([k, v]) => <>
          <h2>{categoryNames[k]}</h2>
          <ul>
            {v.map(i => <li><a href={`/knowledge/${i.category}/${i.id}`}>{i.title}</a></li>)}
          </ul>
        </>)}
      </Frame>
    </>
  );
}