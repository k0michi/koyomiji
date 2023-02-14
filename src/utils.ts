import * as fs from 'fs/promises';
import { Document } from './document';

export async function readFileUTF8(path: string) {
  return await fs.readFile(path, { encoding: 'utf-8' });
}

export function toPathname(path: string[]) {
  return '/' + path.join('/');
}

export function getPathSegment(path: string, index: number) {
  return path.split('/')[index + 1];
}

// TODO: Return map as a tree
export function mapEntries(entries: Document[]) {
  entries.sort((a, b) => a.path.localeCompare(b.path));

  const map: Record<string, Document[]> = {};

  for (const item of entries) {
    const category = getLocation(item).at(-1)!;

    if (map[category] == null) {
      map[category] = [];
    }

    map[category].push(item);
  }

  return map;
}

export function getLocation(document: Document) {
  return document.logicalPath!.split('/').slice(2, -1);
}