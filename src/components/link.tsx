import * as React from 'react';
import { useTransition } from 'react';
import * as ReactRouterDOM from 'react-router-dom'

interface LinkProps {
  href: string;
  children?: any;
  className?: any;
  'aria-label'?: string;
  rel?: string;
}

export default function Link(props: LinkProps) {
  const external = props.href.includes(':');
  const [isPending, startTransition] = useTransition();
  const handleClick = ReactRouterDOM.useLinkClickHandler(props.href);

  return (external ?
    <a href={props.href} className={props.className} aria-label={props['aria-label']} rel={props.rel} target="_blank">{props.children}</a>
    :
    <a href={props.href} className={props.className} aria-label={props['aria-label']} rel={props.rel} onClick={e => {
      e.preventDefault();
      startTransition(() => {
        handleClick(e);
      });
    }}>{props.children}</a>
  );
}