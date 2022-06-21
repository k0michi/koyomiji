import * as Nano from "nano-jsx";
import dateToString from "../date-format.js";
import Frame from "./frame.js";

interface Props {
  title: string;
  id: string;
  created: Date;
  description: string;
  children: any;
}

export default function LogPage(props: Props) {
  const url = `https://koyomiji.com/log/${props.id}`;

  return (
    <>
      <Nano.Helmet>
        <title>{props.title} | 曆路喫茶館</title>
        <meta name="description" content={props.description} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Nano.Helmet>
      <Frame>
        <h1><span class="log-id">#{props.id}</span> {props.title} <span class="log-date">{dateToString(props.created)}</span></h1>
        {props.children}
      </Frame>
    </>
  );
}