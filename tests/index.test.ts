import { expect, test } from "vite-plus/test";
import { getMargin, getPageSize } from "../src/utils/index.ts";

test("resolves preset page size", () => {
  expect(getPageSize("A4")).toEqual({ width: 210, height: 297 });
});

test("resolves axis page margin", () => {
  expect(getMargin({ x: 10, y: 20 })).toEqual({
    top: 20,
    right: 10,
    bottom: 20,
    left: 10,
  });
});

test("keeps explicit page margin sides", () => {
  expect(getMargin({ top: 1, right: 2, bottom: 3, left: 4 })).toEqual({
    top: 1,
    right: 2,
    bottom: 3,
    left: 4,
  });
});
