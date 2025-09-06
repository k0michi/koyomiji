import { useMemo } from 'react';
import ReactFragmentWriter from 'lib/visitor/ReactFragmentWriter';
import KTMLReactTransformer from 'lib/KTMLReactTransformer';
import XMLFragmentParser from 'lib/visitor/XMLFragmentParser';

export type KTMLProps = {
  content: string;
  className?: string;
  style?: React.CSSProperties;
};

function parseAsReact(xml: string) {
  const writer = new ReactFragmentWriter();
  const transformer = new KTMLReactTransformer(writer);
  const reader = new XMLFragmentParser(xml);
  reader.accept(transformer);
  return writer.toReactNode();
}

export default function KTML({ content, className, style }: KTMLProps) {
  const parsed = useMemo(() => parseAsReact(content), [content]);
  return <div className={className} style={style}>{parsed}</div>;
}
