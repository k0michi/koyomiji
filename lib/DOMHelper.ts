export default class DOMHelper {
  static moveChildren(src: Element, dest: Element) {
    while (src.firstChild != null) {
      dest.appendChild(src.firstChild);
    }
  }
}