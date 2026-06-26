import type { NodeSplitResult } from "../types/index.ts";

export interface NodeSplitOptions {
  blockSelectors?: string[];
}

export function splitNodeToFit(
  node: Node,
  measurePage: HTMLElement,
  options: NodeSplitOptions = {},
): NodeSplitResult {
  return splitNodeIntoParent(node, measurePage, measurePage, options);
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

function splitNodeIntoParent(
  node: Node,
  parent: Node,
  measurePage: HTMLElement,
  options: NodeSplitOptions,
): NodeSplitResult {
  if (node.nodeType === Node.TEXT_NODE) return splitTextNodeToFit(node, parent, measurePage);
  if (node.nodeType !== Node.ELEMENT_NODE)
    return splitLeafNodeIntoParent(node, parent, measurePage);

  const element = node as Element;
  if (isImageElement(element)) return splitLeafNodeIntoParent(element, parent, measurePage);
  if (isBlockedElement(element, options.blockSelectors)) {
    if (doesNodeFitEmptyPage(element, measurePage)) {
      return splitLeafNodeIntoParent(element, parent, measurePage);
    }
    if (pageHasContent(measurePage)) {
      return { fit: null, rest: element.cloneNode(true) };
    }
  }
  return splitElementNodeIntoParent(element, parent, measurePage, options);
}

function splitLeafNodeIntoParent(
  node: Node,
  parent: Node,
  measurePage: HTMLElement,
): NodeSplitResult {
  const clone = node.cloneNode(true);
  if (appendNodeIfPageHasRoom(parent, clone, measurePage)) {
    return { fit: clone, rest: null };
  }

  const fittedImage = createPageFittedImage(node, parent, measurePage);
  if (fittedImage && appendNodeIfPageHasRoom(parent, fittedImage, measurePage)) {
    return { fit: fittedImage, rest: null };
  }

  return { fit: null, rest: node.cloneNode(true) };
}

function splitElementNodeIntoParent(
  element: Element,
  parent: Node,
  measurePage: HTMLElement,
  options: NodeSplitOptions,
): NodeSplitResult {
  const fitElement = element.cloneNode(false);
  appendNode(parent, fitElement);

  if (!pageHasRoom(measurePage)) {
    removeNode(fitElement);
    return { fit: null, rest: element.cloneNode(true) };
  }

  const restElement = element.cloneNode(false);
  const hasFitContent = splitElementChildren(
    element,
    fitElement,
    restElement,
    measurePage,
    options,
  );

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
  options: NodeSplitOptions,
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
    const childSplit = splitNodeIntoParent(child, fitElement, measurePage, options);
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
  return (
    measurePage.scrollHeight <= measurePage.clientHeight + 0.5 &&
    measurePage.scrollWidth <= measurePage.clientWidth + 0.5
  );
}

function pageHasContent(measurePage: HTMLElement): boolean {
  return Array.from(measurePage.childNodes).some(isMeaningfulChild);
}

function doesNodeFitEmptyPage(node: Node, measurePage: HTMLElement): boolean {
  const children = Array.from(measurePage.childNodes);
  measurePage.replaceChildren();
  appendNode(measurePage, node.cloneNode(true));
  const fits = pageHasRoom(measurePage);
  measurePage.replaceChildren();
  for (const child of children) appendNode(measurePage, child);
  return fits;
}

function removeNode(node: Node): void {
  node.parentNode?.removeChild(node);
}

function createPageFittedImage(node: Node, parent: Node, measurePage: HTMLElement): Node | null {
  if (node.nodeType !== Node.ELEMENT_NODE || !isImageElement(node as Element)) return null;
  if (hasMeaningfulContentBefore(parent, measurePage)) return null;

  const maxHeight = findLargestFittingImageHeight(node, parent, measurePage);
  if (maxHeight === null) return null;

  const image = node.cloneNode(true) as HTMLElement;
  applyFittedImageStyle(image, maxHeight);
  return image;
}

function hasMeaningfulContentBefore(parent: Node, measurePage: HTMLElement): boolean {
  const ancestorPath = getAncestorPath(parent, measurePage);
  if (ancestorPath.length === 0) return parentHasMeaningfulChildren(parent);

  for (const ancestor of ancestorPath) {
    const previousSiblings = Array.from(ancestor.parentNode?.childNodes ?? []).slice(
      0,
      getChildIndex(ancestor),
    );
    if (previousSiblings.some(isMeaningfulChild)) return true;
  }

  return parentHasMeaningfulChildren(parent);
}

function parentHasMeaningfulChildren(parent: Node): boolean {
  return Array.from(parent.childNodes).some(isMeaningfulChild);
}

function getAncestorPath(node: Node, root: Node): Node[] {
  const path: Node[] = [];
  let current: Node | null = node;

  while (current && current !== root) {
    path.unshift(current);
    current = current.parentNode;
  }

  return current === root ? path : [];
}

function getChildIndex(node: Node): number {
  return Array.from(node.parentNode?.childNodes ?? []).findIndex((child) => child === node);
}

function isMeaningfulChild(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) return (node.textContent?.trim() ?? "") !== "";
  if (node.nodeType === Node.ELEMENT_NODE && isImageElement(node as Element)) return true;
  if (node.nodeType === Node.ELEMENT_NODE) {
    return Array.from(node.childNodes).some(isMeaningfulChild);
  }
  return true;
}

function findLargestFittingImageHeight(
  node: Node,
  parent: Node,
  measurePage: HTMLElement,
): number | null {
  let low = 1;
  let high = Math.max(1, Math.floor(measurePage.clientHeight));
  let best = 0;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const image = node.cloneNode(true) as HTMLElement;
    applyFittedImageStyle(image, middle);
    appendNode(parent, image);

    if (pageHasRoom(measurePage)) {
      best = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }

    removeNode(image);
  }

  return best > 0 ? best : null;
}

function applyFittedImageStyle(image: HTMLElement, maxHeight: number): void {
  const style = image.getAttribute("style");
  const fitStyle = `max-height: ${maxHeight}px; height: auto; width: auto; max-width: 100%; object-fit: contain;`;
  image.setAttribute("style", style ? `${style.trim().replace(/;?$/, ";")} ${fitStyle}` : fitStyle);
}

function isImageElement(element: Element): boolean {
  return element.tagName.toLowerCase() === "img";
}

function isBlockedElement(element: Element, blockSelectors: string[] = []): boolean {
  return blockSelectors.some((selector) => matchesSelector(element, selector));
}

function matchesSelector(element: Element, selector: string): boolean {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

function trimTrailingBreak(value: string): string {
  return value.replace(/\s+$/, "");
}

function trimLeadingBreak(value: string): string {
  return value.replace(/^\s+/, "");
}
