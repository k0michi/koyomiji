import { DictionaryDocument, DictionaryEntry, DictionarySense, ArticleDocument } from '../document';
import { getTextContent, parseXML } from '../xml.js';

export function createDocument(entryPath: string, source: string): DictionaryDocument {
  const $document = parseXML(source);
  const $head = $document.querySelector('head') as Element;
  const title = getTextContent('title', $head)!;
  const description = getTextContent('description', $head)!;
  const created = getTextContent('created', $head)!;
  const modified = getTextContent('modified', $head)!;
  const id = getTextContent('id', $head)!;

  const $entries = $document.querySelector('entries')!;
  const entries: DictionaryEntry[] = [];
  const wordSet = new Set<string>();
  let number = 1;

  for (const $entry of $entries.children) {
    const word = $entry.querySelector('word')?.textContent;
    const senses: DictionarySense[] = [];

    if (word == null) {
      throw new Error("<entry> must have <word>");
    }

    if (wordSet.has(word)) {
      console.error(`Word '${word}' already exists`);
    }

    wordSet.add(word);
    const $senses = $entry.querySelector('senses');

    if ($senses == null) {
      throw new Error("<entry> must have <senses>");
    }

    for (const $sense of $senses.children) {
      let pos = $sense.querySelector('pos')?.textContent;
      let usage = $sense.querySelector('usage')?.outerHTML;
      const gloss = $sense.querySelector('gloss')?.outerHTML;

      if (pos === null) {
        pos = undefined;
      }

      if (usage === null) {
        usage = undefined;
      }

      if (gloss == null) {
        throw new Error("<sense> must have <gloss>");
      }

      senses.push({ pos, usage, gloss });
    }

    entries.push({ word, senses, number });
    number++;
  }

  return { type: 'dictionary', title, id, created, modified, description, path: entryPath, content: entries };
}