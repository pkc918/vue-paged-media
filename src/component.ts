import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
  type CSSProperties,
  type PropType,
} from "vue";
import type {
  PageDimensions,
  PageMarginInput,
  PageMarginSlotProps,
  PaginationResult,
} from "./types/index.ts";
import {
  getMargin,
  getPageSize,
  contentBlockAttribute,
  normalizeColumnCount,
  normalizeColumnGap,
  normalizeContentBlocks,
  paginateSourceBlocks,
} from "./utils/index.ts";

type ColumnRule = boolean | string | CSSProperties;

const pageMarginSlotNames = [
  "header",
  "footer",
  "left",
  "right",
  "top-left-corner",
  "top-right-corner",
  "bottom-left-corner",
  "bottom-right-corner",
] as const;

export const VuePagedMedia = defineComponent({
  name: "VuePagedMedia",
  props: {
    dimensions: {
      type: [String, Object] as PropType<PageDimensions>,
      required: true,
    },
    margin: {
      type: Object as PropType<PageMarginInput>,
      required: true,
    },
    column: {
      type: Number,
      default: 1,
    },
    columnGap: {
      type: Number,
      default: 6,
    },
    columnRule: {
      type: [Boolean, String, Object] as PropType<ColumnRule>,
      default: false,
    },
    pageMarginSlotSize: {
      type: Number,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const sourceRef = ref<HTMLElement | null>(null);
    const measurePageRef = ref<HTMLElement | null>(null);
    const pages = ref<PaginationResult>([]);
    let scheduled = false;
    let mutationObserver: MutationObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const pageSize = computed(() => getPageSize(props.dimensions));
    const pageMargin = computed(() => getMargin(props.margin));
    const pageMarginSlotSize = computed(() => {
      if (!hasPageMarginSlots()) return 0;
      return Math.max(0, props.pageMarginSlotSize ?? 8);
    });
    const pageInset = computed(() => ({
      top: pageMargin.value.top + pageMarginSlotSize.value,
      right: pageMargin.value.right + pageMarginSlotSize.value,
      bottom: pageMargin.value.bottom + pageMarginSlotSize.value,
      left: pageMargin.value.left + pageMarginSlotSize.value,
    }));
    const contentSize = computed(() => ({
      width: pageSize.value.width - pageInset.value.left - pageInset.value.right,
      height: pageSize.value.height - pageInset.value.top - pageInset.value.bottom,
    }));
    const columnCount = computed(() => normalizeColumnCount(props.column));
    const columnGap = computed(() => normalizeColumnGap(props.columnGap));
    const columnSize = computed(() => ({
      width: getColumnWidth(contentSize.value.width, columnCount.value, columnGap.value),
      height: contentSize.value.height,
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

    const contentContainerStyle = computed<CSSProperties>(() => ({
      position: "absolute",
      top: `${pageMarginSlotSize.value}mm`,
      right: `${pageMarginSlotSize.value}mm`,
      bottom: `${pageMarginSlotSize.value}mm`,
      left: `${pageMarginSlotSize.value}mm`,
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

    const columnRuleStyle = computed<CSSProperties | null>(() => {
      if (columnCount.value < 2 || props.columnRule === false) return null;

      const defaultStyle: CSSProperties = {
        position: "absolute",
        top: "0",
        bottom: "0",
        width: "0",
        borderLeft: "0.2mm solid #d1d5db",
        pointerEvents: "none",
      };

      if (props.columnRule === true) return defaultStyle;
      if (typeof props.columnRule === "string") {
        return { ...defaultStyle, borderLeft: props.columnRule };
      }
      return { ...defaultStyle, ...props.columnRule };
    });

    function schedulePagination() {
      if (scheduled) return;
      scheduled = true;
      void nextTick(() => {
        scheduled = false;
        paginate();
      });
    }

    function paginate() {
      const source = sourceRef.value;
      const measurePage = measurePageRef.value;
      if (!source || !measurePage) return;

      const nextPages = paginateSourceBlocks(source, measurePage, {
        columnCount: columnCount.value,
      });
      if (JSON.stringify(pages.value) !== JSON.stringify(nextPages)) {
        pages.value = nextPages;
      }
    }

    function observeSource() {
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      const source = sourceRef.value;
      if (!source) return;

      if (typeof MutationObserver !== "undefined") {
        mutationObserver = new MutationObserver(schedulePagination);
        mutationObserver.observe(source, {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
        });
      }

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(schedulePagination);
        resizeObserver.observe(source);
      }
    }

    onMounted(() => {
      observeSource();
      schedulePagination();
    });
    onUpdated(() => {
      observeSource();
      schedulePagination();
    });
    onBeforeUnmount(() => {
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
    });
    watch(
      () => [
        props.dimensions,
        props.margin,
        props.column,
        props.columnGap,
        props.pageMarginSlotSize,
      ],
      schedulePagination,
      {
        deep: true,
      },
    );

    return () => {
      const blocks = normalizeContentBlocks(slots.default?.() ?? []);
      const pageCount = pages.value.length > 0 ? pages.value.length : blocks.length;

      return h("div", { class: "vue-paged-media" }, [
        h(
          "div",
          {
            ref: sourceRef,
            class: "vue-paged-media__source",
            style: hiddenMeasureStyle.value,
            "aria-hidden": "true",
          },
          blocks.map((block, index) => {
            const common = {
              key: index,
              [contentBlockAttribute]: "",
              style: sourceBlockStyle.value,
            };
            return typeof block === "string"
              ? h("div", { ...common, innerHTML: block })
              : h("div", common, [cloneVNode(block)]);
          }),
        ),
        h("div", {
          ref: measurePageRef,
          class: "vue-paged-media__measure-page",
          style: hiddenMeasureStyle.value,
          "aria-hidden": "true",
        }),
        h(
          "div",
          { class: "vue-paged-media__pages" },
          pages.value.length > 0
            ? pages.value.map((page, index) =>
                h(
                  "section",
                  { key: index, class: "vue-paged-media__page", style: pageStyle.value },
                  [
                    ...renderPageMarginSlots(index, pageCount),
                    h(
                      "div",
                      {
                        class: "vue-paged-media__content-container",
                        style: contentContainerStyle.value,
                      },
                      h(
                        "div",
                        {
                          class: "vue-paged-media__page-content",
                          style: contentStyle.value,
                        },
                        Array.from({ length: columnCount.value }, (_, columnIndex) =>
                          h("div", {
                            key: columnIndex,
                            class: "vue-paged-media__column",
                            style: columnStyle.value,
                            innerHTML: (page[columnIndex] ?? []).join(""),
                          }),
                        ).concat(renderColumnRules()),
                      ),
                    ),
                  ],
                ),
              )
            : blocks.map((block, index) =>
                h(
                  "section",
                  { key: index, class: "vue-paged-media__page", style: pageStyle.value },
                  [
                    ...renderPageMarginSlots(index, pageCount),
                    h(
                      "div",
                      {
                        class: "vue-paged-media__content-container",
                        style: contentContainerStyle.value,
                      },
                      h(
                        "div",
                        {
                          class: "vue-paged-media__page-content",
                          style: fallbackContentStyle.value,
                        },
                        [
                          h(
                            "div",
                            {
                              class: "vue-paged-media__column",
                              style: columnStyle.value,
                            },
                            typeof block === "string"
                              ? h("div", { innerHTML: block })
                              : cloneVNode(block),
                          ),
                          ...renderColumnRules(),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
        ),
      ]);
    };

    function hasPageMarginSlots() {
      return pageMarginSlotNames.some((name) => Boolean(slots[name]));
    }

    function renderPageMarginSlots(index: number, pageCount: number) {
      const slotProps: PageMarginSlotProps = {
        index,
        pageNumber: index + 1,
        pageCount,
      };
      const slotSize = pageMarginSlotSize.value;

      return [
        renderPageMarginSlot("top-left-corner", slotProps, {
          top: "0",
          left: "0",
          width: `${slotSize}mm`,
          height: `${slotSize}mm`,
        }),
        renderPageMarginSlot("header", slotProps, {
          top: "0",
          left: `${slotSize}mm`,
          right: `${slotSize}mm`,
          height: `${slotSize}mm`,
        }),
        renderPageMarginSlot("top-right-corner", slotProps, {
          top: "0",
          right: "0",
          width: `${slotSize}mm`,
          height: `${slotSize}mm`,
        }),
        renderPageMarginSlot("right", slotProps, {
          top: `${slotSize}mm`,
          right: "0",
          bottom: `${slotSize}mm`,
          width: `${slotSize}mm`,
        }),
        renderPageMarginSlot("bottom-right-corner", slotProps, {
          right: "0",
          bottom: "0",
          width: `${slotSize}mm`,
          height: `${slotSize}mm`,
        }),
        renderPageMarginSlot("footer", slotProps, {
          right: `${slotSize}mm`,
          bottom: "0",
          left: `${slotSize}mm`,
          height: `${slotSize}mm`,
        }),
        renderPageMarginSlot("bottom-left-corner", slotProps, {
          bottom: "0",
          left: "0",
          width: `${slotSize}mm`,
          height: `${slotSize}mm`,
        }),
        renderPageMarginSlot("left", slotProps, {
          top: `${slotSize}mm`,
          bottom: `${slotSize}mm`,
          left: "0",
          width: `${slotSize}mm`,
        }),
      ].filter((slot): slot is ReturnType<typeof h> => slot !== null);
    }

    function renderPageMarginSlot(
      name: string,
      slotProps: PageMarginSlotProps,
      style: CSSProperties,
    ) {
      const slot = slots[name];
      if (!slot) return null;

      return h(
        "div",
        {
          class: ["vue-paged-media__page-margin-box", `vue-paged-media__page-margin-box--${name}`],
          style: {
            position: "absolute",
            ...style,
          },
        },
        slot(slotProps),
      );
    }

    function renderColumnRules() {
      const style = columnRuleStyle.value;
      if (!style) return [];

      return Array.from({ length: columnCount.value - 1 }, (_, index) =>
        h("div", {
          key: `rule-${index}`,
          class: "vue-paged-media__column-rule",
          style: {
            ...style,
            left: `${getColumnRuleOffset(index, columnSize.value.width, columnGap.value)}mm`,
          },
          "aria-hidden": "true",
        }),
      );
    }
  },
});

function getColumnWidth(contentWidth: number, columnCount: number, columnGap: number): number {
  const totalGap = columnGap * (columnCount - 1);
  return Math.max(0, (contentWidth - totalGap) / columnCount);
}

function getColumnRuleOffset(columnIndex: number, columnWidth: number, columnGap: number): number {
  return columnWidth * (columnIndex + 1) + columnGap * (columnIndex + 0.5);
}
