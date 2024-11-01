import XMLRootReader from "./XMLRootReader";

export default class XMLDocumentFragmentReader extends XMLRootReader {
  constructor(root: Document);
  constructor(string: string);
  constructor(...args: any[]) {
    super(args[0], true);
  }
}