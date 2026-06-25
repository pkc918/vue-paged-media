import {
  PageMargin,
  type AxisPageMargin,
  type PageSize,
  type PresetPageSize,
} from "../types/index.ts";

const presetPageSizes: Record<PresetPageSize, PageSize> = {
  A4: { width: 210, height: 297 },
  B5: { width: 176, height: 250 },
};

export function getPageSize(presetPage: PresetPageSize | PageSize): PageSize {
  if (typeof presetPage === "string") return presetPageSizes[presetPage];
  return presetPage;
}

export function getMargin(margin: PageMargin | AxisPageMargin): PageMargin {
  if (isAxisPageMargin(margin)) return createMarginFromAxis(margin);
  return createMarginFromSides(margin);
}

function isAxisPageMargin(margin: PageMargin | AxisPageMargin): margin is AxisPageMargin {
  return "x" in margin && "y" in margin;
}

function createMarginFromAxis(margin: AxisPageMargin): PageMargin {
  return new PageMargin(margin.y, margin.x, margin.y, margin.x);
}

function createMarginFromSides(margin: PageMargin): PageMargin {
  return new PageMargin(margin.top, margin.right, margin.bottom, margin.left);
}
