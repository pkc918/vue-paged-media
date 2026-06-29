import type { CSSProperties } from "vue";
import type { PageFlow } from "../types/index.ts";

export function normalizePageFlowCount(value?: number) {
  if (value === undefined) return null;
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
}

export function getPageFlowStyle(flow: PageFlow, count: number | null): CSSProperties {
  if (flow === "x") {
    if (count === null) {
      return {
        display: "grid",
        gridAutoColumns: "max-content",
        gridAutoFlow: "column",
        width: "max-content",
      };
    }

    return {
      display: "grid",
      gridAutoFlow: "row",
      gridTemplateColumns: `repeat(${count}, max-content)`,
      width: "max-content",
    };
  }

  if (count === null) {
    return {
      display: "grid",
      gridAutoFlow: "row",
      gridTemplateColumns: "max-content",
      width: "max-content",
    };
  }

  return {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${count}, max-content)`,
    width: "max-content",
  };
}
