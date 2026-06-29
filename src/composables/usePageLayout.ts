import { computed, type ComputedRef, type CSSProperties } from "vue";
import type { ColumnRule, PageDimensions, PageFlow, PageMarginInput } from "../types/index.ts";
import {
  getColumnRuleStyle,
  getColumnWidth,
  getMargin,
  getPageFlowStyle,
  getPageSize,
  normalizeColumnCount,
  normalizeColumnGap,
  normalizePageFlowCount,
} from "../utils/index.ts";

interface PageLayoutOptions {
  props: {
    dimensions: PageDimensions;
    margin: PageMarginInput;
    column: number;
    columnGap: number;
    columnRule: ColumnRule;
    corner?: number;
    pageFlow: PageFlow;
    pageFlowCount?: number;
  };
  hasPageMarginSlots: ComputedRef<boolean>;
}

export function usePageLayout(options: PageLayoutOptions) {
  const pageSize = computed(() => getPageSize(options.props.dimensions));
  const pageMargin = computed(() => getMargin(options.props.margin));
  const cornerSize = computed(() => {
    if (!options.hasPageMarginSlots.value) return 0;
    return Math.max(0, options.props.corner ?? 8);
  });
  const pageInset = computed(() => ({
    top: pageMargin.value.top + cornerSize.value,
    right: pageMargin.value.right + cornerSize.value,
    bottom: pageMargin.value.bottom + cornerSize.value,
    left: pageMargin.value.left + cornerSize.value,
  }));
  const contentSize = computed(() => ({
    width: pageSize.value.width - pageInset.value.left - pageInset.value.right,
    height: pageSize.value.height - pageInset.value.top - pageInset.value.bottom,
  }));
  const columnCount = computed(() => normalizeColumnCount(options.props.column));
  const columnGap = computed(() => normalizeColumnGap(options.props.columnGap));
  const pageFlowCount = computed(() => normalizePageFlowCount(options.props.pageFlowCount));
  const columnSize = computed(() => ({
    width: getColumnWidth(contentSize.value.width, columnCount.value, columnGap.value),
    height: contentSize.value.height,
  }));

  const rootStyle = computed<CSSProperties>(() => ({
    overflow: "auto",
    maxWidth: "100%",
  }));
  const pageStyle = computed<CSSProperties>(() => ({
    flex: "0 0 auto",
    width: `${pageSize.value.width}mm`,
    height: `${pageSize.value.height}mm`,
    boxSizing: "border-box",
    background: "#fff",
    overflow: "hidden",
    position: "relative",
  }));
  const pagesStyle = computed<CSSProperties>(() =>
    getPageFlowStyle(options.props.pageFlow, pageFlowCount.value),
  );
  const contentContainerStyle = computed<CSSProperties>(() => ({
    position: "absolute",
    top: `${cornerSize.value}mm`,
    right: `${cornerSize.value}mm`,
    bottom: `${cornerSize.value}mm`,
    left: `${cornerSize.value}mm`,
    boxSizing: "border-box",
    padding: `${pageMargin.value.top}mm ${pageMargin.value.right}mm ${pageMargin.value.bottom}mm ${pageMargin.value.left}mm`,
    overflow: "hidden",
  }));
  const contentStyle = computed<CSSProperties>(() => ({
    width: `${contentSize.value.width}mm`,
    height: `${contentSize.value.height}mm`,
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    gap: `${columnGap.value}mm`,
    position: "relative",
  }));
  const fallbackContentStyle = computed<CSSProperties>(() => ({
    width: `${contentSize.value.width}mm`,
    minHeight: `${contentSize.value.height}mm`,
    boxSizing: "border-box",
    display: "flex",
    gap: `${columnGap.value}mm`,
    position: "relative",
  }));
  const columnStyle = computed<CSSProperties>(() => ({
    flex: `0 0 ${columnSize.value.width}mm`,
    width: `${columnSize.value.width}mm`,
    height: `${columnSize.value.height}mm`,
    boxSizing: "border-box",
    overflow: "hidden",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }));
  const sourceBlockStyle = computed<CSSProperties>(() => ({
    width: `${columnSize.value.width}mm`,
    boxSizing: "border-box",
  }));
  const hiddenMeasureStyle = computed<CSSProperties>(() => ({
    position: "absolute",
    left: "-10000px",
    top: "0",
    width: `${columnSize.value.width}mm`,
    height: `${columnSize.value.height}mm`,
    overflow: "hidden",
    visibility: "hidden",
    pointerEvents: "none",
    zIndex: "-1",
    boxSizing: "border-box",
  }));
  const columnRuleStyle = computed<CSSProperties | null>(() =>
    getColumnRuleStyle(columnCount.value, options.props.columnRule),
  );

  return {
    columnCount,
    columnGap,
    columnRuleStyle,
    columnSize,
    columnStyle,
    contentContainerStyle,
    contentStyle,
    cornerSize,
    fallbackContentStyle,
    hiddenMeasureStyle,
    pageSize,
    pageStyle,
    pagesStyle,
    rootStyle,
    sourceBlockStyle,
  };
}
