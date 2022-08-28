import * as React from 'react';
import { useTransition } from 'react';
import * as ReactRouterDOM from 'react-router-dom'

interface LinkProps {
  href: string;
  children: any;
  className?: any;
}

export default function Link(props: LinkProps) {
  const external = props.href.startsWith('http://') || props.href.startsWith('https://');
  const navigate = ReactRouterDOM.useNavigate();
  const [isPending, startTransition] = useTransition();

  return (external ?
    <a href={props.href} className={props.className}>{props.children}</a>
    :
    <a href={props.href} className={props.className} onClick={e=>{
      e.preventDefault();
      startTransition(()=>{
        navigate(props.href);
      });
    }}>{props.children}</a>
  );
}