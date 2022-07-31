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
        <div id="header">
          <h1>{props.title}</h1>
          <div class="meta">
            <div class="date"><div class="calender-icon"></div><div>{dateToString(props.created)}</div></div>
          </div>
        </div>
        {props.children}
      </Frame>
    </>
  );
}