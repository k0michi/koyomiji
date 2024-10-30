import Path from 'node:path';

export default class PathHelper {
  static isPrefixedWithSlash(path: string) {
    return this.split(path)[0] === '';
  }

  static prefixWithSlash(path: string) {
    const segments = this.split(path);

    if (segments[0] !== '') {
      segments.unshift('');
    } else {
      if (segments.length == 1) {
        segments.unshift('');
      }
    }

    return this.join(segments);
  }

  static removeTrailSlash(path: string) {
    const segments = this.split(path);

    if (segments.at(-1) === '' && segments.at(-2) !== '') {
      segments.pop();
    }

    return this.join(segments);
  }

  static containsDots(path: string) {
    const segments = this.split(path);
    return segments.includes('.') || segments.includes('..');
  }

  static isCanonical(path: string) {
    return Path.posix.isAbsolute(path) && !this.containsDots(path);
  }

  static isCanonicalRoot(path: string) {
    return path === Path.posix.sep;
  }

  static pop(path: string) {
    return Path.posix.join(path, '..');
  }

  static push(path1: string, ...paths: string[]) {
    return Path.posix.join(path1, ...paths);
  }

  static slice(path: string, start?: number, end?: number) {
    return this.join(this.split(path).slice(start, end));
  }

  static split(path: string) {
    return path.split(Path.posix.sep);
  }

  static join(segments: string[]) {
    return segments.join(Path.posix.sep);
  }
}