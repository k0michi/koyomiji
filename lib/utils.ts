import * as fs from 'fs/promises';

export function toPathname(path: string[]) {
  path = path.filter(p => p != '');
  return '/' + path.join('/');
}

export function getPathSegment(path: string, index: number) {
  return path.split('/')[index + 1];
}