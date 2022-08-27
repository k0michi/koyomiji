import * as React from "react";
import { Fragment } from "./ktml.js";

export function reactFactory(type: string | Symbol, props: any, ...children: any[]) {
  if (type == Fragment) {
    return React.createElement(React.Fragment, props, ...children);
  }

  if (type == 'math') {
    return React.createElement(Math, props, ...children);
  }

  if (type == 'code') {
    return React.createElement(Code, props, ...children);
  }

  return React.createElement(type as string, props, ...children);
}

interface MathProps {
  display: string;
  children: string;
}

export function Math(props: MathProps) {
  return (props.display == 'block' ?
    <div className="math-block">{props.children}</div>
    :
    <span className="math-inline">{props.children}</span>
  );
}

interface CodeProps {
  display: string;
  lang: string;
  children: string;
}

export function Code(props: CodeProps) {
  return (props.display == 'block' ?
    <pre className={`language-${props.lang}`}><code className={`language-${props.lang}`}>{props.children}</code></pre>
    :
    <code className={`language-${props.lang}`}>{props.children}</code>
  );
}