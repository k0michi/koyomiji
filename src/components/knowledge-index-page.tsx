import * as Nano from "nano-jsx";
import { categoryNames } from "../category.js";
import { PostHead } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: PostHead[];
}

export default function KnowledgeIndexPage(props: Props) {
  const url = `https://koyomiji.com/knowledge`;

  props.items.sort((a, b) => {
    if (a.category == b.category) {
      return a.id.localeCompare(b.id);
    } else {
      return a.category!.localeCompare(b.category!);
    }
  });

  const map: { [key: string]: PostHead[]; } = {};

  for (const item of props.items) {
    if (map[item.category!] == null) {
      map[item.category!] = [];
    }

    map[item.category!].push(item);
  }

  return (
    <>
      <Nano.Helmet>
        <title>Knowledge | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Knowledge" />
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