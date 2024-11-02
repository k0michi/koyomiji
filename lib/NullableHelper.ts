export default class NullableHelper {
  static unwrap<T>(object: T | null | undefined): T {
    if (object === null || object === undefined) {
      throw new Error(`Assertion failed`);
    }

    return object;
  }
}