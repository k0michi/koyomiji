import window from '@k0michi/isomorphic-dom';

export function parseXML(string: string) {
  const parser = new window.DOMParser();
  const $document = parser.parseFromString(string, 'text/xml');

  if (($document.firstChild as Element).tagName == 'parsererror') {
    throw new Error('Failed to parse');
  }

  return $document;
}

export function getTextContent(query: string, $element: Element) {
  if ($element == null) {
    return undefined;
  }

  const $found = $element.querySelector(query);

  if ($found == null) {
    return undefined;
  }

  return $found.textContent!;
}