import { defineComponent, h, ref, type CSSProperties, type PropType } from "vue";
import type { ContentBlock, PaginationResult } from "../types/index.ts";
import { PageSheet } from "./PageSheet.ts";

export const PagesView = defineComponent({
  name: "PagesView",
  props: {
    blocks: {
      type: Array as PropType<ContentBlock[]>,
      required: true,
    },
    contentContainerStyle: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
    contentStyle: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
    fallbackContentStyle: {
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
    pages: {
      type: Array as PropType<PaginationResult>,
      required: true,
    },
    pageStyle: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
    pagesStyle: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
  },
  setup(props, { slots, expose }) {
    const elementRef = ref<HTMLElement | null>(null);
    expose({ element: elementRef });

    return () =>
      h(
        "div",
        { ref: elementRef, class: "vue-paged-media__pages", style: props.pagesStyle },
        hasPaginatedPages() ? renderPaginatedPages() : renderFallbackPages(),
      );

    function hasPaginatedPages() {
      return props.pages.length > 0;
    }

    function getPageCount() {
      return hasPaginatedPages() ? props.pages.length : props.blocks.length;
    }

    function renderPaginatedPages() {
      return props.pages.map((page, index) =>
        h(
          PageSheet,
          {
            key: index,
            contentContainerStyle: props.contentContainerStyle,
            contentStyle: props.contentStyle,
            columnCount: props.columnCount,
            columnGap: props.columnGap,
            columnRuleStyle: props.columnRuleStyle,
            columnStyle: props.columnStyle,
            columnWidth: props.columnWidth,
            cornerSize: props.cornerSize,
            page,
            pageCount: getPageCount(),
            pageIndex: index,
            pageStyle: props.pageStyle,
          },
          slots,
        ),
      );
    }

    function renderFallbackPages() {
      return props.blocks.map((block, index) =>
        h(
          PageSheet,
          {
            key: index,
            block,
            contentContainerStyle: props.contentContainerStyle,
            contentStyle: props.fallbackContentStyle,
            columnCount: props.columnCount,
            columnGap: props.columnGap,
            columnRuleStyle: props.columnRuleStyle,
            columnStyle: props.columnStyle,
            columnWidth: props.columnWidth,
            cornerSize: props.cornerSize,
            pageCount: getPageCount(),
            pageIndex: index,
            pageStyle: props.pageStyle,
          },
          slots,
        ),
      );
    }
  },
});
