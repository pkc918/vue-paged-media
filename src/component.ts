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
  type ComponentPublicInstance,
  type PropType,
} from "vue";
import type {
  ColumnRule,
  PageDimensions,
  PageFlow,
  PageMarginInput,
  PaginationResult,
} from "./types/index.ts";
import { PagesView } from "./components/PagesView.ts";
import { usePageLayout } from "./composables/usePageLayout.ts";
import {
  contentBlockAttribute,
  normalizeContentBlocks,
  pageMarginSlotNames,
  paginateSourceBlocks,
} from "./utils/index.ts";
import { printPagedMedia } from "./utils/print.ts";

export interface VuePagedMediaExpose {
  print: () => Promise<void>;
}

export type VuePagedMediaInstance = ComponentPublicInstance & VuePagedMediaExpose;

interface PagesViewExpose {
  element: HTMLElement | null;
}

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
    blocks: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    corner: {
      type: Number,
      default: undefined,
    },
    pageFlow: {
      type: String as PropType<PageFlow>,
      default: "y",
    },
    pageFlowCount: {
      type: Number,
      default: undefined,
    },
  },
  setup(props, { slots, expose }) {
    const sourceRef = ref<HTMLElement | null>(null);
    const measurePageRef = ref<HTMLElement | null>(null);
    const pagesRef = ref<PagesViewExpose | null>(null);
    const pages = ref<PaginationResult>([]);
    let scheduled = false;
    let mutationObserver: MutationObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const hasPageMarginSlots = computed(() =>
      pageMarginSlotNames.some((name) => Boolean(slots[name])),
    );
    const layout = usePageLayout({
      props,
      hasPageMarginSlots,
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
        columnCount: layout.columnCount.value,
        blocks: props.blocks,
      });
      if (JSON.stringify(pages.value) !== JSON.stringify(nextPages)) {
        pages.value = nextPages;
      }
    }

    async function print() {
      paginate();
      await nextTick();

      const pageElements = Array.from(pagesRef.value?.element?.children ?? []).filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && element.classList.contains("vue-paged-media__page"),
      );

      await printPagedMedia({
        pages: pageElements,
        pageSize: layout.pageSize.value,
      });
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
        props.columnRule,
        props.blocks,
        props.corner,
        props.pageFlow,
        props.pageFlowCount,
      ],
      schedulePagination,
      {
        deep: true,
      },
    );
    expose({ print });

    return () => {
      const blocks = normalizeContentBlocks(slots.default?.() ?? []);

      return h("div", { class: "vue-paged-media", style: layout.rootStyle.value }, [
        h(
          "div",
          {
            ref: sourceRef,
            class: "vue-paged-media__source",
            style: layout.hiddenMeasureStyle.value,
            "aria-hidden": "true",
          },
          blocks.map((block, index) => {
            const common = {
              key: index,
              [contentBlockAttribute]: "",
              style: layout.sourceBlockStyle.value,
            };
            return typeof block === "string"
              ? h("div", { ...common, innerHTML: block })
              : h("div", common, [cloneVNode(block)]);
          }),
        ),
        h("div", {
          ref: measurePageRef,
          class: "vue-paged-media__measure-page",
          style: layout.hiddenMeasureStyle.value,
          "aria-hidden": "true",
        }),
        h(
          PagesView,
          {
            ref: pagesRef,
            blocks,
            contentContainerStyle: layout.contentContainerStyle.value,
            contentStyle: layout.contentStyle.value,
            fallbackContentStyle: layout.fallbackContentStyle.value,
            columnCount: layout.columnCount.value,
            columnGap: layout.columnGap.value,
            columnRuleStyle: layout.columnRuleStyle.value,
            columnStyle: layout.columnStyle.value,
            columnWidth: layout.columnSize.value.width,
            cornerSize: layout.cornerSize.value,
            pages: pages.value,
            pageStyle: layout.pageStyle.value,
            pagesStyle: layout.pagesStyle.value,
          },
          slots,
        ),
      ]);
    };
  },
});
