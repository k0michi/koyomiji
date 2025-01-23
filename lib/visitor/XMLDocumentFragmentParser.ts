import XMLHelper from './XMLHelper';
import XMLDocumentFragmentReader from './XMLDocumentFragmentReader';

export default class XMLDocumentFragmentParser extends XMLDocumentFragmentReader {
  constructor(string: string) {
    super(XMLHelper.parseFragment(string));
  }
}