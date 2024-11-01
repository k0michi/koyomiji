import window from '@k0michi/isomorphic-dom';
import XMLNodeReader from './XMLNodeReader';
import XMLHelper from './XMLHelper';

export default class XMLDocumentReader extends XMLNodeReader {
  constructor(root: Document);
  constructor(string: string);
  constructor(...args: any[]) {
    super(
      typeof (args[0]) === 'string' ?
        XMLHelper.parse(args[0]) :
        args[0]
    );

    if (args.length > 1) {
      throw new Error(`Wrong arguments`);
    }
  }
}