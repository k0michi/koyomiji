export default class URLHelper {
  static toString(pathname: string, origin: string) {
    return new URL(pathname, origin).toString();
  }
}