import { cloneVNode, defineComponent, h, type CSSProperties, type PropType } from "vue";
import type { ContentBlock, PageMarginSlotProps, PaginatedPage } from "../types/index.ts";
import { getColumnRuleOffset, getPageMarginSlotLayout } from "../utils/index.ts";

export const PageSheet = defineComponent({
  name: "PageSheet",
  props: {
    contentContainerStyle: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
    contentStyle: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
    columnCount: {
      type: Number,
      required: true,
    },
    columnGap: {
      type: Number,
      required: true,
    },
    columnRuleStyle: {
      type: Object as PropType<CSSProperties | null>,
      default: null,
    },
    columnStyle: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
    columnWidth: {
      type: Number,
      required: true,
    },
    cornerSize: {
      type: Number,
      required: true,
    },
    page: {
      type: Array as PropType<PaginatedPage>,
      default: undefined,
    },
    block: {
      type: [String, Object] as PropType<ContentBlock>,
      default: undefined,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    pageIndex: {
      type: Number,
      required: true,
    },
    pageStyle: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h("section", { class: "vue-paged-media__page", style: props.pageStyle }, [
        ...renderPageMarginSlots(props.pageIndex, props.pageCount),
        h(
          "div",
          {
            class: "vue-paged-media__content-container",
            style: props.contentContainerStyle,
          },
          h(
            "div",
            {
              class: "vue-paged-media__page-content",
              style: props.contentStyle,
            },
            renderContent(),
          ),
        ),
      ]);

    function renderContent() {
      const columns = props.page ? renderPaginatedColumns(props.page) : renderFallbackColumn();
      return [...columns, ...renderColumnRules()];
    }

    function renderPaginatedColumns(page: PaginatedPage) {
      return Array.from({ length: props.columnCount }, (_, columnIndex) =>
        h("div", {
          key: columnIndex,
          class: "vue-paged-media__column",
          style: props.columnStyle,
          innerHTML: (page[columnIndex] ?? []).join(""),
        }),
      );
    }

    function renderFallbackColumn() {
      const block = props.block;
      const children =
        block === undefined
          ? []
          : typeof block === "string"
            ? [h("div", { innerHTML: block })]
            : [cloneVNode(block)];

      return [
        h(
          "div",
          {
            class: "vue-paged-media__column",
            style: props.columnStyle,
          },
          children,
        ),
      ];
    }

    function renderPageMarginSlots(index: number, pageCount: number) {
      const slotProps: PageMarginSlotProps = {
        index,
        pageNumber: index + 1,
        pageCount,
      };

      return getPageMarginSlotLayout(props.cornerSize)
        .map(({ name, style }) => {
          const slot = slots[name];
          if (!slot) return null;

          return h(
            "div",
            {
              class: [
                "vue-paged-media__page-margin-box",
                `vue-paged-media__page-margin-box--${name}`,
              ],
              style: {
                position: "absolute",
                ...style,
              },
            },
            slot(slotProps),
          );
        })
        .filter((slot): slot is ReturnType<typeof h> => slot !== null);
    }

    function renderColumnRules() {
      if (!props.columnRuleStyle) return [];

      return Array.from({ length: props.columnCount - 1 }, (_, index) =>
        h("div", {
          key: `rule-${index}`,
          class: "vue-paged-media__column-rule",
          style: {
            ...props.columnRuleStyle,
            left: `${getColumnRuleOffset(index, props.columnWidth, props.columnGap)}mm`,
          },
          "aria-hidden": "true",
        }),
      );
    }
  },
});
