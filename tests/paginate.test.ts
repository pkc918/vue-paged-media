import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { contentBlockAttribute, paginateSourceBlocks } from "../src/utils/index.ts";

const originalNode = globalThis.Node;
const originalElement = globalThis.Element;
const originalDocument = globalThis.document;

class FakeNode {
  parentNode: FakeElement | null = null;

  constructor(
    public nodeType: number,
    public nodeName: string,
  ) {}

  get textContent(): string {
    return "";
  }

  set textContent(_value: string) {}

  cloneNode(_deep?: boolean): FakeNode {
    return new FakeNode(this.nodeType, this.nodeName);
  }
}

class FakeText extends FakeNode {
  constructor(private value: string) {
    super(3, "#text");
  }

  override get textContent() {
    return this.value;
  }

  override set textContent(value: string) {
    this.value = value;
  }

  override cloneNode() {
    return new FakeText(this.value);
  }
}

class FakeElement extends FakeNode {
  childNodes: FakeNode[] = [];
  attributes: Record<string, string> = {};
  clientHeight = Number.POSITIVE_INFINITY;
  clientWidth = Number.POSITIVE_INFINITY;

  constructor(public tagName: string) {
    super(1, tagName.toUpperCase());
  }

  override get textContent() {
    return this.childNodes.map((child) => child.textContent).join("");
  }

  get scrollHeight(): number {
    const fixedHeight = Number(this.attributes["data-height"]);
    if (Number.isFinite(fixedHeight)) return getStyledHeight(fixedHeight, this.attributes.style);
    return this.childNodes.reduce((height, child) => height + getNodeHeight(child), 0);
  }

  get scrollWidth(): number {
    const fixedWidth = Number(this.attributes["data-width"]);
    if (Number.isFinite(fixedWidth)) {
      return getStyledWidth(fixedWidth, this.attributes.style, this.parentNode?.clientWidth);
    }
    return Math.max(0, ...this.childNodes.map((child) => getNodeWidth(child)));
  }

  get innerHTML() {
    return this.childNodes.map((child) => serializeNode(child)).join("");
  }

  appendChild<T extends FakeNode>(node: T): T {
    node.parentNode?.removeChild(node);
    node.parentNode = this;
    if (node instanceof FakeElement && !Number.isFinite(node.clientWidth)) {
      node.clientWidth = this.clientWidth;
    }
    this.childNodes.push(node);
    return node;
  }

  removeChild<T extends FakeNode>(node: T): T {
    this.childNodes = this.childNodes.filter((child) => child !== node);
    node.parentNode = null;
    return node;
  }

  replaceChildren() {
    for (const child of this.childNodes) {
      child.parentNode = null;
    }
    this.childNodes = [];
  }

  setAttribute(name: string, value: string) {
    this.attributes[name] = value;
  }

  getAttribute(name: string) {
    return this.attributes[name] ?? null;
  }

  matches(selector: string) {
    if (!selector.startsWith(".")) return false;
    const className = selector.slice(1);
    return (this.attributes.class ?? "").split(/\s+/).includes(className);
  }

  querySelectorAll(selector: string) {
    const attribute = selector.match(/^\[(.+)\]$/)?.[1];
    if (!attribute) return [];

    const matches: FakeElement[] = [];
    visitElements(this, (element) => {
      if (attribute in element.attributes) matches.push(element);
    });
    return matches;
  }

  override cloneNode(deep = false) {
    const clone = new FakeElement(this.tagName.toLowerCase());
    clone.attributes = { ...this.attributes };
    clone.clientHeight = this.clientHeight;
    clone.clientWidth = this.clientWidth;
    if (deep) {
      for (const child of this.childNodes) {
        clone.appendChild(child.cloneNode(true));
      }
    }
    return clone;
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "Node", {
    configurable: true,
    value: { ELEMENT_NODE: 1, TEXT_NODE: 3 },
  });
  Object.defineProperty(globalThis, "Element", {
    configurable: true,
    value: FakeElement,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      createElement: (tagName: string) => new FakeElement(tagName),
      createTextNode: (value: string) => new FakeText(value),
    },
  });
});

afterEach(() => {
  Object.defineProperty(globalThis, "Node", {
    configurable: true,
    value: originalNode,
  });
  Object.defineProperty(globalThis, "Element", {
    configurable: true,
    value: originalElement,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: originalDocument,
  });
});

test("paginateSourceBlocks keeps blocks on the same page while they fit", () => {
  const source = createSource([element("p", [text("aa")]), element("p", [text("bbb")])]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([[["<p>aa</p>", "<p>bbb</p>"]]]);
});

test("paginateSourceBlocks splits the next block when only part of it fits", () => {
  const source = createSource([element("p", [text("aaaa")]), element("p", [text("bbbb")])]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [["<p>aaaa</p>", "<p>b</p>"]],
    [["<p>bbb</p>"]],
  ]);
});

test("paginateSourceBlocks moves the next block when the current page is full", () => {
  const source = createSource([element("p", [text("aaaaa")]), element("p", [text("bbbb")])]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [["<p>aaaaa</p>"]],
    [["<p>bbbb</p>"]],
  ]);
});

test("paginateSourceBlocks splits an oversized text block and keeps its wrapper", () => {
  const source = createSource([element("p", [text("abcdefgh")])]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([[["<p>abcde</p>"]], [["<p>fgh</p>"]]]);
});

test("paginateSourceBlocks splits a nested tree and carries the remaining tree to the next page", () => {
  const source = createSource([
    element("article", [
      element("h1", [text("ab")]),
      element("p", [text("cdef")]),
      element("footer", [text("gh")]),
    ]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [["<article><h1>ab</h1><p>cde</p></article>"]],
    [["<article><p>f</p><footer>gh</footer></article>"]],
  ]);
});

test("paginateSourceBlocks rebuilds every ancestor around split content", () => {
  const source = createSource([
    element("article", [
      element("section", [element("div", [element("p", [text("abcdefgh")])])]),
      element("footer", [text("ij")]),
    ]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [["<article><section><div><p>abcde</p></div></section></article>"]],
    [["<article><section><div><p>fgh</p></div></section><footer>ij</footer></article>"]],
  ]);
});

test("paginateSourceBlocks fills columns before creating the next page", () => {
  const source = createSource([
    element("p", [text("aaaaa")]),
    element("p", [text("bbbbb")]),
    element("p", [text("cc")]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage, { columnCount: 2 })).toEqual([
    [["<p>aaaaa</p>"], ["<p>bbbbb</p>"]],
    [["<p>cc</p>"]],
  ]);
});

test("paginateSourceBlocks continues split content in the next column", () => {
  const source = createSource([element("p", [text("aaaa")]), element("p", [text("bbbb")])]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage, { columnCount: 2 })).toEqual([
    [["<p>aaaa</p>", "<p>b</p>"], ["<p>bbb</p>"]],
  ]);
});

test("paginateSourceBlocks keeps configured block selectors unsplit", () => {
  const source = createSource([
    element("p", [text("aaaa")]),
    element("div", [text("bbbb")], { class: "keep-together" }),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage, { blocks: [".keep-together"] })).toEqual([
    [["<p>aaaa</p>"]],
    [['<div class="keep-together">bbbb</div>']],
  ]);
});

test("paginateSourceBlocks keeps nested configured block selectors unsplit", () => {
  const source = createSource([
    element("article", [
      element("h1", [text("aa")]),
      element("section", [text("bbbb")], { class: "keep-together" }),
      element("footer", [text("c")]),
    ]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage, { blocks: [".keep-together"] })).toEqual([
    [["<article><h1>aa</h1></article>"]],
    [['<article><section class="keep-together">bbbb</section><footer>c</footer></article>']],
  ]);
});

test("paginateSourceBlocks splits configured blocks that are taller than an empty page", () => {
  const source = createSource([element("div", [text("abcdefgh")], { class: "keep-together" })]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage, { blocks: [".keep-together"] })).toEqual([
    [['<div class="keep-together">abcde</div>']],
    [['<div class="keep-together">fgh</div>']],
  ]);
});

test("paginateSourceBlocks starts oversized configured blocks on the next page before splitting", () => {
  const source = createSource([
    element("p", [text("aaaa")]),
    element("div", [text("bcdefghi")], { class: "keep-together" }),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage, { blocks: [".keep-together"] })).toEqual([
    [["<p>aaaa</p>"]],
    [['<div class="keep-together">bcdef</div>']],
    [['<div class="keep-together">ghi</div>']],
  ]);
});

test("paginateSourceBlocks starts nested oversized configured blocks on the next page before splitting", () => {
  const source = createSource([
    element("article", [
      element("h1", [text("aa")]),
      element("section", [text("bcdefghi")], { class: "keep-together" }),
    ]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage, { blocks: [".keep-together"] })).toEqual([
    [["<article><h1>aa</h1></article>"]],
    [['<article><section class="keep-together">bcdef</section></article>']],
    [['<article><section class="keep-together">ghi</section></article>']],
  ]);
});

test("paginateSourceBlocks starts oversized configured blocks in the next column before splitting", () => {
  const source = createSource([
    element("p", [text("aaaa")]),
    element("div", [text("bcdefghi")], { class: "keep-together" }),
  ]);
  const measurePage = createMeasurePage(5);

  expect(
    paginateSourceBlocks(source, measurePage, { blocks: [".keep-together"], columnCount: 2 }),
  ).toEqual([
    [["<p>aaaa</p>"], ['<div class="keep-together">bcdef</div>']],
    [['<div class="keep-together">ghi</div>']],
  ]);
});

test("paginateSourceBlocks shrinks images that are taller than an empty page", () => {
  const source = createSource([element("img", [], { "data-height": "8" })]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [
      [
        '<img data-height="8" style="max-height: 5px; height: auto; width: auto; max-width: 100%; object-fit: contain;"></img>',
      ],
    ],
  ]);
});

test("paginateSourceBlocks shrinks images that are wider than an empty page", () => {
  const source = createSource([element("img", [], { "data-height": "3", "data-width": "8" })]);
  const measurePage = createMeasurePage(5, 5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [
      [
        '<img data-height="3" data-width="8" style="max-height: 5px; height: auto; width: auto; max-width: 100%; object-fit: contain;"></img>',
      ],
    ],
  ]);
});

test("paginateSourceBlocks starts oversized images on the next page before shrinking", () => {
  const source = createSource([
    element("p", [text("aaaa")]),
    element("img", [], { "data-height": "8" }),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [["<p>aaaa</p>"]],
    [
      [
        '<img data-height="8" style="max-height: 5px; height: auto; width: auto; max-width: 100%; object-fit: contain;"></img>',
      ],
    ],
  ]);
});

test("paginateSourceBlocks starts nested oversized images on the next page before shrinking", () => {
  const source = createSource([
    element("section", [element("h2", [text("aa")]), element("img", [], { "data-height": "8" })]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [["<section><h2>aa</h2></section>"]],
    [
      [
        '<section><img data-height="8" style="max-height: 5px; height: auto; width: auto; max-width: 100%; object-fit: contain;"></img></section>',
      ],
    ],
  ]);
});

test("paginateSourceBlocks shrinks oversized images inside empty wrappers", () => {
  const source = createSource([
    element("section", [
      element("img", [], {
        "data-height": "8",
        style: "width: 100%; height: 360mm;",
      }),
    ]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [
      [
        '<section><img data-height="8" style="width: 100%; height: 360mm; max-height: 5px; height: auto; width: auto; max-width: 100%; object-fit: contain;"></img></section>',
      ],
    ],
  ]);
});

test("paginateSourceBlocks starts empty image wrappers on the next page before shrinking images", () => {
  const source = createSource([
    element("p", [text("aaaa")]),
    element("section", [element("img", [], { "data-height": "8" })]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    [["<p>aaaa</p>"]],
    [
      [
        '<section><img data-height="8" style="max-height: 5px; height: auto; width: auto; max-width: 100%; object-fit: contain;"></img></section>',
      ],
    ],
  ]);
});

test("paginateSourceBlocks starts oversized images in the next column before shrinking", () => {
  const source = createSource([
    element("p", [text("aaaa")]),
    element("section", [element("img", [], { "data-height": "8" })]),
  ]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage, { columnCount: 2 })).toEqual([
    [
      ["<p>aaaa</p>"],
      [
        '<section><img data-height="8" style="max-height: 5px; height: auto; width: auto; max-width: 100%; object-fit: contain;"></img></section>',
      ],
    ],
  ]);
});

function createSource(blocks: FakeElement[]) {
  const source = new FakeElement("div");
  for (const block of blocks) {
    const wrapper = new FakeElement("div");
    wrapper.setAttribute(contentBlockAttribute, "");
    wrapper.appendChild(block);
    source.appendChild(wrapper);
  }
  return source as unknown as HTMLElement;
}

function createMeasurePage(clientHeight: number, clientWidth = Number.POSITIVE_INFINITY) {
  const measurePage = new FakeElement("div");
  measurePage.clientHeight = clientHeight;
  measurePage.clientWidth = clientWidth;
  return measurePage as unknown as HTMLElement;
}

function element(tagName: string, children: FakeNode[], attributes: Record<string, string> = {}) {
  const node = new FakeElement(tagName);
  node.attributes = { ...attributes };
  for (const child of children) {
    node.appendChild(child);
  }
  return node;
}

function text(value: string) {
  return new FakeText(value);
}

function visitElements(element: FakeElement, callback: (element: FakeElement) => void) {
  callback(element);
  for (const child of element.childNodes) {
    if (child instanceof FakeElement) {
      visitElements(child, callback);
    }
  }
}

function serializeNode(node: FakeNode): string {
  if (node.nodeType === 3) return escapeHtml(node.textContent);
  if (!(node instanceof FakeElement)) return "";

  const attributes = Object.entries(node.attributes)
    .map(([name, value]) => (value ? ` ${name}="${escapeHtml(value)}"` : ` ${name}`))
    .join("");
  return `<${node.tagName}${attributes}>${node.innerHTML}</${node.tagName}>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getStyledHeight(height: number, style = "") {
  const maxHeight = style.match(/max-height:\s*(\d+(?:\.\d+)?)px/)?.[1];
  return maxHeight ? Math.min(height, Number(maxHeight)) : height;
}

function getStyledWidth(width: number, style = "", parentWidth = Number.POSITIVE_INFINITY) {
  if (/max-width:\s*100%/.test(style)) return Math.min(width, parentWidth);
  return width;
}

function getNodeHeight(node: FakeNode): number {
  return node instanceof FakeElement ? node.scrollHeight : node.textContent.length;
}

function getNodeWidth(node: FakeNode): number {
  return node instanceof FakeElement ? node.scrollWidth : node.textContent.length;
}
