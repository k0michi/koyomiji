import React from "react";
import ReactMutableNode from "./ReactMutableNode";
import ReactNodeVisitor from "./ReactNodeVisitor";
import ReactNodeWriter from "./ReactNodeWriter";

export default class ReactFragmentWriter extends ReactNodeWriter {
  constructor(next?: ReactNodeVisitor | null) {
    super(next, ReactMutableNode.createElement(React.Fragment));
  }
}