import XMLHelper from './XMLHelper';
import XMLDocumentReader from './XMLDocumentReader';

export default class XMLDocumentParser extends XMLDocumentReader {
  constructor(string: string) {
    super(XMLHelper.parse(string));
  }
}