import type { NodeSplitResult } from "../types/index.ts";

export function splitNodeToFit(node: Node, measurePage: HTMLElement): NodeSplitResult {
  return splitNodeIntoParent(node, measurePage, measurePage);
}

export function appendNode(parent: Node, node: Node): void {
  parent.appendChild(node);
}

export function appendNodeIfPageHasRoom(
  parent: Node,
  node: Node,
  measurePage: HTMLElement,
): boolean {
  parent.appendChild(node);
  if (pageHasRoom(measurePage)) return true;
  removeNode(node);
  return false;
}

function splitNodeIntoParent(node: Node, parent: Node, measurePage: HTMLElement): NodeSplitResult {
  if (node.nodeType === Node.TEXT_NODE) return splitTextNodeToFit(node, parent, measurePage);
  if (node.nodeType !== Node.ELEMENT_NODE)
    return splitLeafNodeIntoParent(node, parent, measurePage);
  return splitElementNodeIntoParent(node as Element, parent, measurePage);
}

function splitLeafNodeIntoParent(
  node: Node,
  parent: Node,
  measurePage: HTMLElement,
): NodeSplitResult {
  const clone = node.cloneNode(true);
  return appendNodeIfPageHasRoom(parent, clone, measurePage)
    ? { fit: clone, rest: null }
    : { fit: null, rest: node.cloneNode(true) };
}

function splitElementNodeIntoParent(
  element: Element,
  parent: Node,
  measurePage: HTMLElement,
): NodeSplitResult {
  const fitElement = element.cloneNode(false);
  appendNode(parent, fitElement);

  if (!pageHasRoom(measurePage)) {
    removeNode(fitElement);
    return { fit: null, rest: element.cloneNode(true) };
  }

  const restElement = element.cloneNode(false);
  const hasFitContent = splitElementChildren(element, fitElement, restElement, measurePage);

  if (!hasFitContent) removeNode(fitElement);

  return {
    fit: hasFitContent ? fitElement : null,
    rest: restElement.childNodes.length > 0 ? restElement : null,
  };
}

function splitElementChildren(
  sourceElement: Element,
  fitElement: Node,
  restElement: Node,
  measurePage: HTMLElement,
): boolean {
  const children = Array.from(sourceElement.childNodes);
  let hasFitContent = false;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    const childClone = child.cloneNode(true);
    appendNode(fitElement, childClone);

    if (pageHasRoom(measurePage)) {
      hasFitContent = true;
      continue;
    }

    removeNode(childClone);
    const childSplit = splitNodeIntoParent(child, fitElement, measurePage);
    if (childSplit.fit) hasFitContent = true;
    if (childSplit.rest) appendNode(restElement, childSplit.rest);
    appendRemainingChildren(children, index + 1, restElement);
    break;
  }

  return hasFitContent;
}

function splitTextNodeToFit(node: Node, parent: Node, measurePage: HTMLElement): NodeSplitResult {
  const text = node.textContent ?? "";
  const splitIndex = findLongestFittingTextIndex(text, parent, measurePage);
  const fitText = getFittingText(text, splitIndex);
  const restText = trimLeadingBreak(text.slice(splitIndex));
  const fit = splitIndex > 0 ? document.createTextNode(fitText) : null;

  if (fit) appendNode(parent, fit);

  return {
    fit,
    rest: restText ? document.createTextNode(restText) : null,
  };
}

function findLongestFittingTextIndex(text: string, parent: Node, measurePage: HTMLElement): number {
  let low = 0;
  let high = text.length;
  let best = 0;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = document.createTextNode(text.slice(0, middle));
    appendNode(parent, candidate);

    if (pageHasRoom(measurePage)) {
      best = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }

    removeNode(candidate);
  }

  return best;
}

function getFittingText(text: string, splitIndex: number): string {
  const fitText = text.slice(0, splitIndex);
  if (splitIndex >= text.length) return fitText;
  return trimTrailingBreak(fitText);
}

function appendRemainingChildren(children: Node[], startIndex: number, parent: Node): void {
  for (const child of children.slice(startIndex)) {
    appendNode(parent, child.cloneNode(true));
  }
}

function pageHasRoom(measurePage: HTMLElement): boolean {
  return measurePage.scrollHeight <= measurePage.clientHeight + 0.5;
}

function removeNode(node: Node): void {
  node.parentNode?.removeChild(node);
}

function trimTrailingBreak(value: string): string {
  return value.replace(/\s+$/, "");
}

function trimLeadingBreak(value: string): string {
  return value.replace(/^\s+/, "");
}
