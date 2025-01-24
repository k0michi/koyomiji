// DEPRECATED

export function getPathSegment(path: string, index: number) {
  return path.split('/')[index + 1];
}