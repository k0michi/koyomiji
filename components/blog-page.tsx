import * as Nano from "nano-jsx";
import dateToString from "../date-format.js";
import Frame from "./frame.js";

interface Props {
  title: string;
  id: string;
  created: Date;
  children: any;
}

export default function BlogPage(props: Props) {
  return (
    <>
      <Nano.Helmet>
        <title>{props.title} | 曆路堂</title>
      </Nano.Helmet>
      <Frame>
        <h1><span class="blog-id">#{props.id}</span> {props.title} <span class="blog-date">{dateToString(props.created)}</span></h1>
        {props.children}
      </Frame>
    </>
  );
}