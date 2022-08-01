import * as React from 'react';
import { Helmet } from 'react-helmet';
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
      <Helmet>
        <title>[{categoryName}] {props.title} | 曆路喫茶館</title>
        <meta name="description" content={props.description} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      <header>
        <h1>{props.title}</h1>
        <div className="meta">
          <div className="date"><div className="calender-icon"></div><div>{dateToString(props.created)}</div></div>
          <div className="tags"><div className="tags-icon"></div><div>{categoryNames[props.category]}</div></div>
        </div>
      </header>
      {props.children}
    </>
  );
}