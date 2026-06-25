import type {
  PaginatedColumn,
  PaginatedPage,
  PaginationOptions,
  PaginationResult,
} from "../types/index.ts";
import { getSourceBlockNodes } from "./content.ts";
import { normalizeColumnCount } from "./page.ts";
import { appendNode, appendNodeIfPageHasRoom, splitNodeToFit } from "./split.ts";

export function paginateSourceBlocks(
  source: HTMLElement,
  measurePage: HTMLElement,
  options: PaginationOptions = {},
): PaginationResult {
  const pages: PaginationResult = [];
  const blocks = getSourceBlockNodes(source);
  const columnCount = normalizeColumnCount(options.columnCount);
  clearMeasurePage(measurePage);

  let currentColumn: PaginatedColumn = [];
  let currentPage: PaginatedPage = [];

  for (const block of blocks) {
    const result = appendBlockAcrossColumns(
      block,
      currentColumn,
      currentPage,
      pages,
      measurePage,
      columnCount,
    );
    currentColumn = result.currentColumn;
    currentPage = result.currentPage;
  }

  if (currentColumn.length > 0) {
    currentPage = commitColumn(currentColumn, currentPage, pages, measurePage, columnCount);
    currentColumn = [];
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  if (pages.length === 0) return [[[]]];
  return pages;
}

function appendBlockAcrossColumns(
  block: Node,
  currentColumn: PaginatedColumn,
  currentPage: PaginatedPage,
  pages: PaginationResult,
  measurePage: HTMLElement,
  columnCount: number,
): { currentColumn: PaginatedColumn; currentPage: PaginatedPage } {
  let rest: Node | null = block;
  let column = currentColumn;
  let page = currentPage;

  while (rest) {
    const result = appendNodeAcrossColumns(rest, column, page, pages, measurePage, columnCount);
    rest = result.rest;
    column = result.currentColumn;
    page = result.currentPage;
  }

  return { currentColumn: column, currentPage: page };
}

function appendNodeAcrossColumns(
  node: Node,
  currentColumn: PaginatedColumn,
  currentPage: PaginatedPage,
  pages: PaginationResult,
  measurePage: HTMLElement,
  columnCount: number,
): { currentColumn: PaginatedColumn; currentPage: PaginatedPage; rest: Node | null } {
  const whole = node.cloneNode(true);
  if (appendNodeIfPageHasRoom(measurePage, whole, measurePage)) {
    currentColumn.push(serializeNodeToHtml(whole));
    return { currentColumn, currentPage, rest: null };
  }

  const split = splitNodeToFit(node, measurePage);
  if (split.fit) currentColumn.push(serializeNodeToHtml(split.fit));

  if (currentColumn.length > 0) {
    return {
      currentColumn: [],
      currentPage: commitColumn(currentColumn, currentPage, pages, measurePage, columnCount),
      rest: split.rest,
    };
  }

  return {
    currentColumn: [],
    currentPage: appendOverflowingNodeToEmptyColumn(
      split.rest ?? node,
      currentColumn,
      currentPage,
      pages,
      measurePage,
      columnCount,
    ),
    rest: null,
  };
}

function commitColumn(
  currentColumn: PaginatedColumn,
  currentPage: PaginatedPage,
  pages: PaginationResult,
  measurePage: HTMLElement,
  columnCount: number,
): PaginatedPage {
  currentPage.push(currentColumn);
  clearMeasurePage(measurePage);
  if (currentPage.length < columnCount) return currentPage;
  pages.push(currentPage);
  return [];
}

function appendOverflowingNodeToEmptyColumn(
  node: Node,
  currentColumn: PaginatedColumn,
  currentPage: PaginatedPage,
  pages: PaginationResult,
  measurePage: HTMLElement,
  columnCount: number,
): PaginatedPage {
  const overflow = node.cloneNode(true);
  appendNode(measurePage, overflow);
  currentColumn.push(serializeNodeToHtml(overflow));
  return commitColumn(currentColumn, currentPage, pages, measurePage, columnCount);
}

function clearMeasurePage(measurePage: HTMLElement): void {
  measurePage.replaceChildren();
}

function serializeNodeToHtml(node: Node): string {
  const container = document.createElement("div");
  container.appendChild(node.cloneNode(true));
  return container.innerHTML;
}
