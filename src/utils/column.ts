import type { CSSProperties } from "vue";
import type { ColumnRule } from "../types/index.ts";

export function normalizeColumnCount(column: number | undefined): number {
  if (column === undefined || !Number.isFinite(column)) return 1;
  return Math.max(1, Math.floor(column));
}

export function normalizeColumnGap(columnGap: number | undefined): number {
  if (columnGap === undefined || !Number.isFinite(columnGap)) return 6;
  return Math.max(0, columnGap);
}

export function getColumnWidth(
  contentWidth: number,
  columnCount: number,
  columnGap: number,
): number {
  const totalGap = columnGap * (columnCount - 1);
  return Math.max(0, (contentWidth - totalGap) / columnCount);
}

export function getColumnRuleOffset(
  columnIndex: number,
  columnWidth: number,
  columnGap: number,
): number {
  return columnWidth * (columnIndex + 1) + columnGap * (columnIndex + 0.5);
}

export function getColumnRuleStyle(
  columnCount: number,
  columnRule: ColumnRule,
): CSSProperties | null {
  if (columnCount < 2 || columnRule === false) return null;

  const defaultStyle: CSSProperties = {
    position: "absolute",
    top: "0",
    bottom: "0",
    width: "0",
    borderLeft: "0.2mm solid #d1d5db",
    pointerEvents: "none",
  };

  if (columnRule === true) return defaultStyle;
  if (typeof columnRule === "string") {
    return { ...defaultStyle, borderLeft: columnRule };
  }
  return { ...defaultStyle, ...columnRule };
}
