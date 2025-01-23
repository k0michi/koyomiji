import KTMLReactTransformer from "lib/KTMLReactTransformer";
import ReactFragmentWriter from "lib/visitor/ReactFragmentWriter";
import XMLFragmentReader from "lib/visitor/XMLFragmentReader";

export default class KTMLHelper {
  static parseAsReact(xml: string) {
    const writer = new ReactFragmentWriter();
    const transformer = new KTMLReactTransformer(writer);
    const reader = XMLFragmentReader.fromString(xml);
    reader.accept(transformer);
    return writer.toReactNode();
  }
}