import Path from 'node:path';

export default class PathHelper {
  static isPrefixedWithSlash(path: string) {
    return this.split(path)[0] === '';
  }

  static prefixWithSlash(path: string) {
    const segments = PathHelper.split(path);

    if (segments[0] !== '') {
      segments.unshift('');
    } else {
      if (segments.length == 1) {
        segments.unshift('');
      }
    }

    return PathHelper.join(segments);
  }

  static removeTrailSlash(path: string) {
    const segments = PathHelper.split(path);

    if (segments.at(-1) === '' && segments.at(-2) !== '') {
      segments.pop();
    }

    return PathHelper.join(segments);
  }

  static slice(path: string, start?: number, end?: number) {
    return PathHelper.join(PathHelper.split(path).slice(start, end));
  }

  static split(path: string) {
    return path.split('/');
  }

  static join(segments: string[]) {
    return segments.join('/');
  }
}