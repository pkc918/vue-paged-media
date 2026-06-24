import { Fragment, h } from "vue";
import { expect, test } from "vite-plus/test";
import { normalizeContentBlocks } from "../src/utils/index.ts";

test("normalizeContentBlocks keeps normal vnodes as content blocks", () => {
  const vnode = h("p", "hello");

  expect(normalizeContentBlocks([vnode])).toEqual([vnode]);
});

test("normalizeContentBlocks expands fragment children", () => {
  const first = h("p", "first");
  const second = h("p", "second");
  const fragment = h(Fragment, null, [first, second]);

  expect(normalizeContentBlocks([fragment])).toEqual([first, second]);
});

test("normalizeContentBlocks parses a json html array string into separate blocks", () => {
  expect(normalizeContentBlocks(['["<p>a</p>","<p>b</p>"]'])).toEqual(["<p>a</p>", "<p>b</p>"]);
});

test("normalizeContentBlocks treats a plain html string as one block", () => {
  expect(normalizeContentBlocks(["<section>plain html</section>"])).toEqual([
    "<section>plain html</section>",
  ]);
});

test("normalizeContentBlocks drops blank text blocks", () => {
  expect(normalizeContentBlocks(["  "])).toEqual([]);
});
