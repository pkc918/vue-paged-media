import type { CSSProperties } from "vue";

export const pageMarginSlotNames = [
  "header",
  "footer",
  "left",
  "right",
  "top-left-corner",
  "top-right-corner",
  "bottom-left-corner",
  "bottom-right-corner",
] as const;

export type PageMarginSlotName = (typeof pageMarginSlotNames)[number];

export function getPageMarginSlotLayout(slotSize: number): Array<{
  name: PageMarginSlotName;
  style: CSSProperties;
}> {
  return [
    {
      name: "top-left-corner",
      style: {
        top: "0",
        left: "0",
        width: `${slotSize}mm`,
        height: `${slotSize}mm`,
      },
    },
    {
      name: "header",
      style: {
        top: "0",
        left: `${slotSize}mm`,
        right: `${slotSize}mm`,
        height: `${slotSize}mm`,
      },
    },
    {
      name: "top-right-corner",
      style: {
        top: "0",
        right: "0",
        width: `${slotSize}mm`,
        height: `${slotSize}mm`,
      },
    },
    {
      name: "right",
      style: {
        top: `${slotSize}mm`,
        right: "0",
        bottom: `${slotSize}mm`,
        width: `${slotSize}mm`,
      },
    },
    {
      name: "bottom-right-corner",
      style: {
        right: "0",
        bottom: "0",
        width: `${slotSize}mm`,
        height: `${slotSize}mm`,
      },
    },
    {
      name: "footer",
      style: {
        right: `${slotSize}mm`,
        bottom: "0",
        left: `${slotSize}mm`,
        height: `${slotSize}mm`,
      },
    },
    {
      name: "bottom-left-corner",
      style: {
        bottom: "0",
        left: "0",
        width: `${slotSize}mm`,
        height: `${slotSize}mm`,
      },
    },
    {
      name: "left",
      style: {
        top: `${slotSize}mm`,
        bottom: `${slotSize}mm`,
        left: "0",
        width: `${slotSize}mm`,
      },
    },
  ];
}
