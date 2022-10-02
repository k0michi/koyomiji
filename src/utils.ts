import * as fs from 'fs/promises';
import * as path from 'path';
import formatInTimeZone from 'date-fns-tz/esm/formatInTimeZone';

export async function readFileUTF8(path: string) {
  return await fs.readFile(path, { encoding: 'utf-8' });
}

export function compareArray<T>(a1: Array<T>, a2: Array<T>) {
  return a1.length == a2.length && a1.every((v, i) => v == a2[i]);
}

export function toPathname(path: string[]) {
  return '/' + path.join('/');
}