import * as React from "react";
import Code from "./components/code.js";
import Image from "./components/image.js";
import Link from "./components/link.js";
import Math from "./components/math.js";
import { Fragment } from "./xml.js";

export function reactFactory(type: string | Symbol, props: any, ...children: any[]) {
  if (type == Fragment) {
    return React.createElement(React.Fragment, props, ...children);
  }

  if (type == 'math') {
    return React.createElement(Math, { ...props, display: 'block' }, ...children);
  }

  if (type == 'inline-math') {
    return React.createElement(Math, { ...props, display: 'inline' }, ...children);
  }

  if (type == 'code') {
    return React.createElement(Code, { ...props, display: 'block' }, ...children);
  }

  if (type == 'inline-code') {
    return React.createElement(Code, { ...props, display: 'inline' }, ...children);
  }

  if (type == 'a') {
    return React.createElement(Link, props, ...children);
  }

  if (type == 'img') {
    return React.createElement(Image, props, ...children);
  }

  return React.createElement(type as string, props, ...children);
}