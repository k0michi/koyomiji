import * as fs from 'fs/promises';

export async function readFileUTF8(path: string) {
  return await fs.readFile(path, { encoding: 'utf-8' });
}

export function toPathname(path: string[]) {
  return '/' + path.join('/');
}

export function getPathSegment(path: string, index: number) {
  return path.split('/')[index + 1];
}