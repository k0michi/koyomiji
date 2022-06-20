import * as Nano from "nano-jsx";
import { categoryNames } from "../category.js";
import dateToString from "../date-format.js";
import Frame from "./frame.js";

interface Props {
  title: string;
  id: string;
  category: string;
  created: Date;
  description: string;
  children: any;
}

export default function KnowledgePage(props: Props) {
  const categoryName = categoryNames[props.category];
  const url = `https://koyomiji.com/knowledge/${props.category}/${props.id}`;

  return (
    <>
      <Nano.Helmet>
        <title>[{categoryName}] {props.title} | 曆路喫茶館</title>
        <meta name="description" content={props.description} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Nano.Helmet>
      <Frame>
        <h1>[{categoryName}] {props.title} <span class="blog-date">{dateToString(props.created)}</span></h1>
        {props.children}
      </Frame>
    </>
  );
}