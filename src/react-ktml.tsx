import * as React from "react";
import Code from "./components/code.js";
import { Math } from "./components/math.js";
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