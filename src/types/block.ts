import type { VNode } from "vue";

export type ContentBlock = string | VNode;

export interface NodeSplitResult {
  fit: Node | null;
  rest: Node | null;
}
