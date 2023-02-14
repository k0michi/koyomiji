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