import window from '@k0michi/isomorphic-dom';
import XMLNodeReader from './XMLNodeReader';
import XMLHelper from './XMLHelper';

export default class XMLDocumentFragmentReader extends XMLNodeReader {
  constructor(container: DocumentFragment) {
    super(container);
  }

  static fromString(string: string) {
    return new XMLDocumentFragmentReader(XMLHelper.parseFragment(string));
  }
}