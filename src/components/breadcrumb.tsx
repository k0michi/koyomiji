import * as React from 'react';
import Link from './link';

export interface BreadcrumbLink {
  name: string;
  link?: string;
}

export interface BreadcrumbProps {
  links: BreadcrumbLink[];
}

export default function Breadcrumb(props: BreadcrumbProps) {
  return <div>{interleave(props.links.map(l => <span>{
    l.link != undefined ? <Link href={l.link}>{l.name}</Link>
      : l.name
  }</span>), ' > ')}</div>;
}

function interleave(array: Array<any>, joiner: string) {
  for (let i = array.length - 1; i >= 1; i--) {
    array.splice(i, 0, <span>{joiner}</span>);
  }

  return array;
}