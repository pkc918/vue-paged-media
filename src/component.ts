import { defineComponent, h } from "vue";
import { getMargin, getPageSize } from "./utils/page.ts";

interface PagedProps {
  dimensions: "A4" | "B5" | { width: number; height: number };
  margin: { top: number; right: number; bottom: number; left: number } | { x: number; y: number };
}

export const VuePagedMedia = defineComponent<PagedProps>({
  name: "VuePagedMedia",
  setup(props, { emit }) {
    const { dimensions, margin } = props;
    const { width, height } = getPageSize(dimensions);
    const { top, right, bottom, left } = getMargin(margin);

    console.log(width, height, top, right, bottom, left);

    return h("div", "hello vue paged media");
  },
});
