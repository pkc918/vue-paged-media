import type { NodeSplitResult, PaginationResult } from "../types/index.ts";
import { contentBlockAttribute } from "./content.ts";

export function paginateSourceBlocks(
  source: HTMLElement,
  measurePage: HTMLElement,
): PaginationResult {
  const nextPages: PaginationResult = [];
  const blocks = getSourceBlocks(source);
  resetMeasurePage(measurePage);

  let currentPage: string[] = [];

  function commitPage() {
    nextPages.push(currentPage);
    currentPage = [];
    resetMeasurePage(measurePage);
  }

  for (const block of blocks) {
    let rest: Node | null = block;

    while (rest) {
      const whole = rest.cloneNode(true);
      if (appendIfFits(measurePage, whole)) {
        currentPage.push(nodeToHtml(whole));
        rest = null;
        continue;
      }

      const split = splitNodeToFit(rest, measurePage);
      if (split.fit) {
        currentPage.push(nodeToHtml(split.fit));
      }

      if (currentPage.length > 0) {
        commitPage();
        rest = split.rest;
        continue;
      }

      const overflow = split.rest?.cloneNode(true) ?? rest.cloneNode(true);
      appendWithoutFitCheck(measurePage, overflow);
      currentPage.push(nodeToHtml(overflow));
      commitPage();
      rest = null;
    }
  }

  if (currentPage.length > 0 || nextPages.length === 0) {
    nextPages.push(currentPage);
  }

  return nextPages;
}

function getSourceBlocks(source: HTMLElement): Node[] {
  return Array.from(source.querySelectorAll<HTMLElement>(`[${contentBlockAttribute}]`))
    .map((block) => getBlockNode(block))
    .filter((node): node is Node => node !== null);
}

function getBlockNode(block: HTMLElement): Node | null {
  const meaningfulChildren = Array.from(block.childNodes).filter((node) => {
    return node.nodeType !== Node.TEXT_NODE || (node.textContent?.trim() ?? "") !== "";
  });
  if (meaningfulChildren.length === 1) return meaningfulChildren[0].cloneNode(true);
  if (meaningfulChildren.length === 0) return null;
  return block.cloneNode(true);
}

function resetMeasurePage(measurePage: HTMLElement) {
  measurePage.replaceChildren();
}

function appendWithoutFitCheck(parent: Node, node: Node) {
  parent.appendChild(node);
}

function appendIfFits(measurePage: HTMLElement, node: Node) {
  measurePage.appendChild(node);
  if (pageHasRoom(measurePage)) return true;
  removeNode(node);
  return false;
}

function pageHasRoom(measurePage: HTMLElement) {
  return measurePage.scrollHeight <= measurePage.clientHeight + 0.5;
}

function splitNodeToFit(node: Node, measurePage: HTMLElement): NodeSplitResult {
  return splitNodeIntoParent(node, measurePage, measurePage);
}

function splitNodeIntoParent(node: Node, parent: Node, measurePage: HTMLElement): NodeSplitResult {
  if (node.nodeType === Node.TEXT_NODE) {
    return splitTextIntoParent(node, parent, measurePage);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    const clone = node.cloneNode(true);
    return appendIfFits(measurePage, clone)
      ? { fit: clone, rest: null }
      : { fit: null, rest: node.cloneNode(true) };
  }

  const element = node as Element;
  const fitElement = element.cloneNode(false);
  parent.appendChild(fitElement);
  if (!pageHasRoom(measurePage)) {
    removeNode(fitElement);
    return { fit: null, rest: element.cloneNode(true) };
  }

  const restElement = element.cloneNode(false);
  const children = Array.from(element.childNodes);
  let hasFitContent = false;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    const childClone = child.cloneNode(true);
    fitElement.appendChild(childClone);

    if (pageHasRoom(measurePage)) {
      hasFitContent = true;
      continue;
    }

    removeNode(childClone);
    const childSplit = splitNodeIntoParent(child, fitElement, measurePage);
    if (childSplit.fit) hasFitContent = true;
    if (childSplit.rest) restElement.appendChild(childSplit.rest);

    for (const remainingChild of children.slice(index + 1)) {
      restElement.appendChild(remainingChild.cloneNode(true));
    }
    break;
  }

  if (!hasFitContent) {
    removeNode(fitElement);
  }

  return {
    fit: hasFitContent ? fitElement : null,
    rest: restElement.childNodes.length > 0 ? restElement : null,
  };
}

function splitTextIntoParent(node: Node, parent: Node, measurePage: HTMLElement): NodeSplitResult {
  const text = node.textContent ?? "";
  let low = 0;
  let high = text.length;
  let best = 0;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = document.createTextNode(text.slice(0, middle));
    parent.appendChild(candidate);

    if (pageHasRoom(measurePage)) {
      best = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
    removeNode(candidate);
  }

  const bestNode = best > 0 ? document.createTextNode(text.slice(0, best)) : null;
  if (bestNode && best < text.length) {
    bestNode.textContent = trimTrailingBreak(text.slice(0, best));
  }
  if (bestNode) parent.appendChild(bestNode);

  const restText = trimLeadingBreak(text.slice(best));
  return {
    fit: bestNode,
    rest: restText ? document.createTextNode(restText) : null,
  };
}

function trimTrailingBreak(value: string) {
  return value.replace(/\s+$/, "");
}

function trimLeadingBreak(value: string) {
  return value.replace(/^\s+/, "");
}

function removeNode(node: Node) {
  node.parentNode?.removeChild(node);
}

function nodeToHtml(node: Node) {
  const container = document.createElement("div");
  container.appendChild(node.cloneNode(true));
  return container.innerHTML;
}
