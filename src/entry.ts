export interface Entry {
  title: string;
  created: string;
  description: string;
  source?: string;
  path: string[];
  content?: string;
}

export function mapEntries(entries: Entry[]) {
  entries.sort((a, b) => {
    if (a.path[1] == b.path[1]) {
      return a.path[2].localeCompare(b.path[2]);
    } else {
      return a.path[1].localeCompare(b.path[1]);
    }
  });

  const map: Record<string, Entry[]> = {};

  for (const item of entries) {
    if (map[item.path[1]] == null) {
      map[item.path[1]] = [];
    }

    map[item.path[1]].push(item);
  }

  return map;
}