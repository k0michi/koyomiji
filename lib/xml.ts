// DEPRECATED

import window from '@k0michi/isomorphic-dom';

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

export function newElementCreator(document: Document, namespace: string) {
  return (type: string, props: Record<string, string> = {}, children?: string) => {
    const $elem = document.createElementNS(namespace, type);

    for (const [key, value] of Object.entries(props)) {
      $elem.setAttribute(key, value);
    }

    if (children != null) {
      $elem.append(children);
    }

    return $elem;
  };
}