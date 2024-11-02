import window from '@k0michi/isomorphic-dom';
import XMLNodeReader from './XMLNodeReader';
import XMLHelper from './XMLHelper';

export default class XMLDocumentReader extends XMLNodeReader {
  constructor(container: Document) {
    super(container);
  }

  static fromString(string: string) {
    return new XMLDocumentReader(XMLHelper.parse(string));
  }
}