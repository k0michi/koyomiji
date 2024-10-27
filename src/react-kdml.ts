import * as React from "react";
import Placeholder from "./components/placeholder.js";
import { Fragment } from "../lib/xml.js";

export function reactFactory(type: string | Symbol, props: any, ...children: any[]) {
  if (type == Fragment) {
    return React.createElement(React.Fragment, props, ...children);
  }

  if (type == 'ph1') {
    props.number = 1;
    return React.createElement(Placeholder, props, ...children);
  }

  return React.createElement(type as string, props, ...children);
}