import * as Nano from "nano-jsx";
import Frame from "./frame.js";

interface Props {
  title: string;
  id: string;
  created: string;
  children: any;
}

export default function BlogPage(props: Props) {
  return (
    <>
      <Nano.Helmet>
        <title>{props.title} | 曆路堂</title>
      </Nano.Helmet>
      <Frame>
        <h1><span class="blog-id">#{props.id}</span> {props.title} <span class="blog-date">{props.created}</span></h1>
        {props.children}
      </Frame>
    </>
  );
}