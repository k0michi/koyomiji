export interface Document {
  type: string;
  title: string;
  id: string;
  created: string;
  modified: string;
  description: string;
  path: string;
  logicalPath?: string;
}

export interface ArticleDocument extends Document {
  type: 'article';
  source?: string;
  content?: string;
}

export interface DictionaryDocument extends Document {
  type: 'dictionary';
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