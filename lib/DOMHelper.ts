export default class DOMHelper {
  static moveChildren(src: Element, dest: Element) {
    while (src.firstChild != null) {
      dest.appendChild(src.firstChild);
    }
  }

  static copyAttributes(src: Element, dest: Element) {
    for (const at of src.attributes) {
      dest.setAttributeNS(at.namespaceURI, at.name, at.value);
    }
  }
}