import { Fragment, Text as VueText, type VNode } from "vue";
import type { ContentBlock } from "../types/block.ts";

export const contentBlockAttribute = "data-vpm-content-block";

export function normalizeContentBlocks(blocks: unknown[]): ContentBlock[] {
  return flattenContentBlocks(blocks);
}

function flattenContentBlocks(blocks: unknown[]): ContentBlock[] {
  return blocks.flatMap((block) => {
    if (typeof block === "string") return parseHtmlBlocks(block);
    if (!isVNode(block)) return [];
    if (block.type === Fragment && Array.isArray(block.children)) {
      return flattenContentBlocks(block.children);
    }
    if (block.type === VueText && typeof block.children === "string") {
      return parseHtmlBlocks(block.children);
    }
    return [block];
  });
}

function parseHtmlBlocks(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed;
    }
  } catch {
    // Plain text from the default slot is also treated as one HTML block.
  }
  return [value];
}

function isVNode(value: unknown): value is VNode {
  return typeof value === "object" && value !== null && "__v_isVNode" in value;
}
