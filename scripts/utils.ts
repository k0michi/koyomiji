import window from "@k0michi/isomorphic-dom";

export function getIndent($elem: Element) {
  const $first = $elem.firstChild!;

  if ($first.nodeType == window.Node.TEXT_NODE) {
    const data = ($first as Text).data;

    if (data.trim() == '') {
      return data;
    }
  }

  return null;
}

export function getElemAfter($elem: Element) {
  if ($elem.lastChild?.nodeType == window.Node.TEXT_NODE) {
    return $elem.lastChild;
  }

  return null;
}