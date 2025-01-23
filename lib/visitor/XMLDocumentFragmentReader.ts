import XMLNodeReader from './XMLNodeReader';

export default class XMLDocumentFragmentReader extends XMLNodeReader {
  constructor(container: DocumentFragment) {
    super(container);
  }
}