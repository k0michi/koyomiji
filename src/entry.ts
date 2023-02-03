export interface Document {
  type: string;
  title: string;
  id: string;
  created: string;
  modified: string;
  description: string;
  path: string;
}

export interface ArticleDocument extends Document {
  type: 'article';
  source?: string;
  content?: string;
}

export interface DictionaryDocument {
  type: 'dictionary';
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

export function mapEntries(entries: Document[]) {
  entries.sort((a, b) => a.path.localeCompare(b.path));

  const map: Record<string, Document[]> = {};

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