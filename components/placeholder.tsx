import * as React from 'react';

export interface PlaceholderProps {
  number?: number;
}

export default function Placeholder(props: PlaceholderProps) {
  return <>_{props.number != null ? <sub>{props.number}</sub> : null}</>;
}