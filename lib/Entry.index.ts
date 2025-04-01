export interface Entry {
  title: string;
  id: string;
  created: string;
  modified: string;
  taken?: string;
  description: string;
  source?: string;
  path: string;
  content?: string;
  private: boolean;
}

export interface Dictionary {
  title: string;
  created: string;
  description: string;
  path: string;
  content?: DictionaryEntry[];
}

export interface DictionaryEntry {
  word: string;
  senses: DictionarySense[];
  number: number;
}

export interface DictionarySense {
  pos?: string;
  usage?: string;
  gloss: string;
}

export function mapEntries(entries: Entry[]) {
  entries.sort((a, b) => a.path.localeCompare(b.path));

  const map: Record<string, Entry[]> = {};

  for (const item of entries) {
    const category = getCategory(item.path);

    if (map[category] == null) {
      map[category] = [];
    }

    map[category].push(item);
  }

  return map;
}

function getCategory(path: string) {
  return path.split('/')[2];
}