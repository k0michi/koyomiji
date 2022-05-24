import * as Nano from "nano-jsx";
import { categoryNames } from "../category.js";
import { KnowledgeItem } from "../post.js";
import Frame from "./frame.js";

interface Props {
  items: KnowledgeItem[];
}

export default function KnowledgeIndexPage(props: Props) {
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
        <title>備忘録 | 曆路堂</title>
      </Nano.Helmet>
      <Frame>
        {props.items.map(i => <>
          <h2>{categoryNames[i.category]}</h2>
          <ul>
            <li><a href={`/knowledge/${i.category}/${i.id}/`}>{i.title}</a></li>
          </ul>
        </>)}
      </Frame>
    </>
  );
}