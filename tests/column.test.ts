import { expect, test } from "vite-plus/test";
import { getColumnRuleOffset, getColumnRuleStyle, getColumnWidth } from "../src/utils/index.ts";

test("getColumnWidth subtracts gaps before dividing content width", () => {
  expect(getColumnWidth(100, 2, 10)).toBe(45);
  expect(getColumnWidth(20, 3, 12)).toBe(0);
});

test("getColumnRuleOffset places rules in the middle of column gaps", () => {
  expect(getColumnRuleOffset(0, 45, 10)).toBe(50);
  expect(getColumnRuleOffset(1, 45, 10)).toBe(105);
});

test("getColumnRuleStyle returns no rule when columns or rule config disable it", () => {
  expect(getColumnRuleStyle(1, true)).toBeNull();
  expect(getColumnRuleStyle(2, false)).toBeNull();
});

test("getColumnRuleStyle resolves default, string, and object rule styles", () => {
  expect(getColumnRuleStyle(2, true)).toMatchObject({
    borderLeft: "0.2mm solid #d1d5db",
    pointerEvents: "none",
  });

  expect(getColumnRuleStyle(2, "0.5mm dashed red")).toMatchObject({
    borderLeft: "0.5mm dashed red",
  });

  expect(getColumnRuleStyle(2, { borderLeft: "1mm solid blue", opacity: "0.5" })).toMatchObject({
    borderLeft: "1mm solid blue",
    opacity: "0.5",
  });
});
