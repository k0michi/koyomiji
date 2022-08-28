import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom'

interface LinkProps {
  href: string;
  children: any;
  className?: any;
}

export default function Link(props: LinkProps) {
  const external = props.href.startsWith('http://') || props.href.startsWith('https://');

  return (external ?
    <a href={props.href} className={props.className}>{props.children}</a>
    :
    <ReactRouterDOM.Link to={props.href} className={props.className}>{props.children}</ReactRouterDOM.Link>
  );
}