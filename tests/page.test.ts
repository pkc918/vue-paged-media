import { expect, test } from "vite-plus/test";
import { AxisPageMargin, PageMargin } from "../src/types/index.ts";
import {
  getMargin,
  getPageSize,
  normalizeColumnCount,
  normalizeColumnGap,
} from "../src/utils/index.ts";

test("getPageSize resolves preset page sizes", () => {
  expect(getPageSize("A4")).toEqual({ width: 210, height: 297 });
  expect(getPageSize("B5")).toEqual({ width: 176, height: 250 });
});

test("getPageSize keeps custom page sizes unchanged", () => {
  const pageSize = { width: 100, height: 200 };

  expect(getPageSize(pageSize)).toBe(pageSize);
});

test("getMargin converts axis margins into page sides", () => {
  expect(getMargin({ x: 10, y: 20 })).toEqual({
    top: 20,
    right: 10,
    bottom: 20,
    left: 10,
  });

  expect(getMargin(new AxisPageMargin(5, 8))).toEqual({
    top: 8,
    right: 5,
    bottom: 8,
    left: 5,
  });
});

test("getMargin keeps explicit page margin sides", () => {
  expect(getMargin({ top: 1, right: 2, bottom: 3, left: 4 })).toEqual({
    top: 1,
    right: 2,
    bottom: 3,
    left: 4,
  });

  expect(getMargin(new PageMargin(4, 3, 2, 1))).toEqual({
    top: 4,
    right: 3,
    bottom: 2,
    left: 1,
  });
});

test("normalizeColumnCount keeps column counts as positive integers", () => {
  expect(normalizeColumnCount(undefined)).toBe(1);
  expect(normalizeColumnCount(0)).toBe(1);
  expect(normalizeColumnCount(2.8)).toBe(2);
  expect(normalizeColumnCount(Number.NaN)).toBe(1);
});

test("normalizeColumnGap keeps column gaps as non-negative millimeters", () => {
  expect(normalizeColumnGap(undefined)).toBe(6);
  expect(normalizeColumnGap(-2)).toBe(0);
  expect(normalizeColumnGap(8.5)).toBe(8.5);
  expect(normalizeColumnGap(Number.NaN)).toBe(6);
});
