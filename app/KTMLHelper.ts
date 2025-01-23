import KTMLReactTransformer from "lib/KTMLReactTransformer";
import ReactFragmentWriter from "lib/visitor/ReactFragmentWriter";
import XMLFragmentParser from "lib/visitor/XMLFragmentParser";

export default class KTMLHelper {
  static parseAsReact(xml: string) {
    const writer = new ReactFragmentWriter();
    const transformer = new KTMLReactTransformer(writer);
    const reader = new XMLFragmentParser(xml);
    reader.accept(transformer);
    return writer.toReactNode();
  }
}