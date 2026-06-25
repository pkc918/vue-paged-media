import type { PaginationResult } from "../types/index.ts";
import { getSourceBlockNodes } from "./content.ts";
import { appendNode, appendNodeIfPageHasRoom, splitNodeToFit } from "./split.ts";

export function paginateSourceBlocks(
  source: HTMLElement,
  measurePage: HTMLElement,
): PaginationResult {
  const pages: PaginationResult = [];
  const blocks = getSourceBlockNodes(source);
  clearMeasurePage(measurePage);

  let currentPage: string[] = [];

  for (const block of blocks) {
    currentPage = appendBlockAcrossPages(block, currentPage, pages, measurePage);
  }

  if (currentPage.length > 0 || pages.length === 0) {
    pages.push(currentPage);
  }

  return pages;
}

function appendBlockAcrossPages(
  block: Node,
  currentPage: string[],
  pages: PaginationResult,
  measurePage: HTMLElement,
): string[] {
  let rest: Node | null = block;
  let page = currentPage;

  while (rest) {
    const result = appendNodeAcrossPages(rest, page, pages, measurePage);
    rest = result.rest;
    page = result.currentPage;
  }

  return page;
}

function appendNodeAcrossPages(
  node: Node,
  currentPage: string[],
  pages: PaginationResult,
  measurePage: HTMLElement,
): { currentPage: string[]; rest: Node | null } {
  const whole = node.cloneNode(true);
  if (appendNodeIfPageHasRoom(measurePage, whole, measurePage)) {
    currentPage.push(serializeNodeToHtml(whole));
    return { currentPage, rest: null };
  }

  const split = splitNodeToFit(node, measurePage);
  if (split.fit) currentPage.push(serializeNodeToHtml(split.fit));

  if (currentPage.length > 0) {
    return { currentPage: commitPage(currentPage, pages, measurePage), rest: split.rest };
  }

  appendOverflowingNodeToEmptyPage(split.rest ?? node, currentPage, pages, measurePage);
  return { currentPage: [], rest: null };
}

function commitPage(
  currentPage: string[],
  pages: PaginationResult,
  measurePage: HTMLElement,
): string[] {
  pages.push(currentPage);
  clearMeasurePage(measurePage);
  return [];
}

function appendOverflowingNodeToEmptyPage(
  node: Node,
  currentPage: string[],
  pages: PaginationResult,
  measurePage: HTMLElement,
): void {
  const overflow = node.cloneNode(true);
  appendNode(measurePage, overflow);
  currentPage.push(serializeNodeToHtml(overflow));
  commitPage(currentPage, pages, measurePage);
}

function clearMeasurePage(measurePage: HTMLElement): void {
  measurePage.replaceChildren();
}

function serializeNodeToHtml(node: Node): string {
  const container = document.createElement("div");
  container.appendChild(node.cloneNode(true));
  return container.innerHTML;
}
