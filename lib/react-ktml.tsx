import * as React from "react";
import Code from "../components/code";
import Image from "../components/image";
import Math from "../components/math";
import { Fragment } from "../lib/xml";
import { Link } from "react-router";

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

  if (type == 'a') {
    props['to'] = props['href'];
    return React.createElement(Link, props, ...children);
  }

  if (type == 'img') {
    return React.createElement(Image, props, ...children);
  }

  return React.createElement(type as string, props, ...children);
}