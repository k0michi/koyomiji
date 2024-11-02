import KTMLReactTransformer from "lib/KTMLReactTransformer";
import ReactFragmentWriter from "lib/visitor/ReactFragmentWriter";
import XMLDocumentFragmentReader from "lib/visitor/XMLDocumentFragmentReader";

export default class KTMLHelper {
  static parseAsReact(xml: string) {
    const writer = new ReactFragmentWriter();
    const transformer = new KTMLReactTransformer(writer);
    const reader = XMLDocumentFragmentReader.fromString(xml);
    reader.accept(transformer);
    return writer.toReactNode();
  }
}