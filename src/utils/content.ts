import { Fragment, Text as VueText, type VNode } from "vue";
import type { ContentBlock } from "../types/block.ts";

export const contentBlockAttribute = "data-vpm-content-block";

export function normalizeContentBlocks(blocks: unknown[]): ContentBlock[] {
  return blocks.flatMap((block) => normalizeContentBlock(block));
}

export function getSourceBlockNodes(source: HTMLElement): Node[] {
  return Array.from(source.querySelectorAll<HTMLElement>(`[${contentBlockAttribute}]`))
    .map((block) => cloneContentBlockNode(block))
    .filter((node): node is Node => node !== null);
}

function normalizeContentBlock(block: unknown): ContentBlock[] {
  if (typeof block === "string") return parseHtmlBlocks(block);
  if (!isVNode(block)) return [];
  if (isFragmentWithChildren(block)) return normalizeContentBlocks(block.children);
  if (isTextVNode(block)) return parseHtmlBlocks(block.children);
  return [block];
}

function parseHtmlBlocks(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (isJsonStringArray(trimmed)) return JSON.parse(trimmed) as string[];
  return [value];
}

function isJsonStringArray(value: string): boolean {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string");
  } catch {
    return false;
  }
}

function cloneContentBlockNode(block: HTMLElement): Node | null {
  const meaningfulChildren = Array.from(block.childNodes).filter(isMeaningfulChildNode);
  if (meaningfulChildren.length === 0) return null;
  if (meaningfulChildren.length === 1) return meaningfulChildren[0].cloneNode(true);
  return block.cloneNode(true);
}

function isMeaningfulChildNode(node: Node): boolean {
  return node.nodeType !== Node.TEXT_NODE || (node.textContent?.trim() ?? "") !== "";
}

function isFragmentWithChildren(block: VNode): block is VNode & { children: unknown[] } {
  return block.type === Fragment && Array.isArray(block.children);
}

function isTextVNode(block: VNode): block is VNode & { children: string } {
  return block.type === VueText && typeof block.children === "string";
}

function isVNode(value: unknown): value is VNode {
  return typeof value === "object" && value !== null && "__v_isVNode" in value;
}
