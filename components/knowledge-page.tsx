import * as Nano from "nano-jsx";
import { categoryNames } from "../category.js";
import dateToString from "../date-format.js";
import Frame from "./frame.js";

interface Props {
  title: string;
  id: string;
  category: string;
  created: Date;
  children: any;
}

export default function KnowledgePage(props: Props) {
  const categoryName = categoryNames[props.category];

  return (
    <>
      <Nano.Helmet>
        <title>[{categoryName}] {props.title} | 曆路堂</title>
      </Nano.Helmet>
      <Frame>
        <h1>[{categoryName}] {props.title} <span class="blog-date">{dateToString(props.created)}</span></h1>
        {props.children}
      </Frame>
    </>
  );
}