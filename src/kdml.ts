import { Dictionary, DictionaryEntry, DictionarySense, Entry } from './entry';
import { getTextContent, parseXML } from './xml.js';

export function preprocess(entryPath: string[], content: string): Dictionary {
  const $document = parseXML(content);
  const $head = $document.querySelector('head') as Element;
  const title = getTextContent('title', $head)!;
  const description = getTextContent('description', $head)!;
  const created = getTextContent('created', $head)!;

  const $entries = $document.querySelector('entries')!;
  const entries: DictionaryEntry[] = [];

  for (const $entry of $entries.children) {
    const word = $entry.querySelector('word')?.textContent;
    const senses: DictionarySense[] = [];

    if (word == null) {
      throw new Error("<entry> must have <word>");
    }

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

    entries.push({ word, senses });
  }

  return { title, created, description, path: entryPath, content: entries };
}