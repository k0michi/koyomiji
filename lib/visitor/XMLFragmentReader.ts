import XMLNodeReader from './XMLNodeReader';

export default class XMLFragmentReader extends XMLNodeReader {
  constructor(container: DocumentFragment) {
    super(container);
  }
}