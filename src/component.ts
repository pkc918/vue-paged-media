import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted,
  onUpdated,
  ref,
  type CSSProperties,
  type PropType,
} from "vue";
import type { PageDimensions, PageMarginInput } from "./types/page.ts";
import type { PaginationResult } from "./types/pagination.ts";
import {
  getMargin,
  getPageSize,
  contentBlockAttribute,
  normalizeContentBlocks,
  paginateSourceBlocks,
} from "./utils/index.ts";

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
  },
  setup(props, { slots }) {
    const sourceRef = ref<HTMLElement | null>(null);
    const measurePageRef = ref<HTMLElement | null>(null);
    const pages = ref<PaginationResult>([]);
    let scheduled = false;

    const pageSize = computed(() => getPageSize(props.dimensions));
    const pageMargin = computed(() => getMargin(props.margin));
    const contentSize = computed(() => ({
      width: pageSize.value.width - pageMargin.value.left - pageMargin.value.right,
      height: pageSize.value.height - pageMargin.value.top - pageMargin.value.bottom,
    }));

    const pageStyle = computed<CSSProperties>(() => ({
      width: `${pageSize.value.width}mm`,
      minHeight: `${pageSize.value.height}mm`,
      boxSizing: "border-box",
      padding: `${pageMargin.value.top}mm ${pageMargin.value.right}mm ${pageMargin.value.bottom}mm ${pageMargin.value.left}mm`,
      background: "#fff",
      overflow: "hidden",
    }));

    const contentStyle = computed<CSSProperties>(() => ({
      width: `${contentSize.value.width}mm`,
      minHeight: `${contentSize.value.height}mm`,
      boxSizing: "border-box",
    }));

    const hiddenMeasureStyle = computed<CSSProperties>(() => ({
      position: "absolute",
      left: "-10000px",
      top: "0",
      width: `${contentSize.value.width}mm`,
      height: `${contentSize.value.height}mm`,
      overflow: "hidden",
      visibility: "hidden",
      pointerEvents: "none",
      zIndex: "-1",
      boxSizing: "border-box",
    }));

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

      const nextPages = paginateSourceBlocks(source, measurePage);
      if (JSON.stringify(pages.value) !== JSON.stringify(nextPages)) {
        pages.value = nextPages;
      }
    }

    onMounted(schedulePagination);
    onUpdated(schedulePagination);

    return () => {
      const blocks = normalizeContentBlocks(slots.default?.() ?? []);

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
              style: contentStyle.value,
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
          pages.value.map((page, index) =>
            h("section", { key: index, class: "vue-paged-media__page", style: pageStyle.value }, [
              h("div", {
                class: "vue-paged-media__page-content",
                style: contentStyle.value,
                innerHTML: page.join(""),
              }),
            ]),
          ),
        ),
      ]);
    };
  },
});
