import {
  PageMargin,
  type AxisPageMargin,
  type PageSize,
  type PresetPageSize,
} from "../types/index.ts";

const pageSize: Record<PresetPageSize, PageSize> = {
  A4: { width: 210, height: 297 },
  B5: { width: 176, height: 250 },
};

export function getPageSize(presetPage: PresetPageSize | PageSize): PageSize {
  if (typeof presetPage === "string") {
    return pageSize[presetPage];
  }
  return presetPage;
}

export function getMargin(margin: PageMargin | AxisPageMargin): PageMargin {
  if ("x" in margin && "y" in margin) {
    const { x, y } = margin;
    return new PageMargin(y, x, y, x);
  }
  return new PageMargin(margin.top, margin.right, margin.bottom, margin.left);
}
