import XMLHelper from './XMLHelper';
import XMLFragmentReader from './XMLFragmentReader';

export default class XMLFragmentParser extends XMLFragmentReader {
  constructor(string: string) {
    super(XMLHelper.parseFragment(string));
  }
}