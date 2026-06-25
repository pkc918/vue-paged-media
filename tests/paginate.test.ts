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

  constructor(public tagName: string) {
    super(1, tagName.toUpperCase());
  }

  override get textContent() {
    return this.childNodes.map((child) => child.textContent).join("");
  }

  get scrollHeight() {
    return this.textContent.length;
  }

  get innerHTML() {
    return this.childNodes.map((child) => serializeNode(child)).join("");
  }

  appendChild<T extends FakeNode>(node: T): T {
    node.parentNode?.removeChild(node);
    node.parentNode = this;
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

  expect(paginateSourceBlocks(source, measurePage)).toEqual([["<p>aa</p>", "<p>bbb</p>"]]);
});

test("paginateSourceBlocks splits the next block when only part of it fits", () => {
  const source = createSource([element("p", [text("aaaa")]), element("p", [text("bbbb")])]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([
    ["<p>aaaa</p>", "<p>b</p>"],
    ["<p>bbb</p>"],
  ]);
});

test("paginateSourceBlocks moves the next block when the current page is full", () => {
  const source = createSource([element("p", [text("aaaaa")]), element("p", [text("bbbb")])]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([["<p>aaaaa</p>"], ["<p>bbbb</p>"]]);
});

test("paginateSourceBlocks splits an oversized text block and keeps its wrapper", () => {
  const source = createSource([element("p", [text("abcdefgh")])]);
  const measurePage = createMeasurePage(5);

  expect(paginateSourceBlocks(source, measurePage)).toEqual([["<p>abcde</p>"], ["<p>fgh</p>"]]);
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
    ["<article><h1>ab</h1><p>cde</p></article>"],
    ["<article><p>f</p><footer>gh</footer></article>"],
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
    ["<article><section><div><p>abcde</p></div></section></article>"],
    ["<article><section><div><p>fgh</p></div></section><footer>ij</footer></article>"],
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

function createMeasurePage(clientHeight: number) {
  const measurePage = new FakeElement("div");
  measurePage.clientHeight = clientHeight;
  return measurePage as unknown as HTMLElement;
}

function element(tagName: string, children: FakeNode[]) {
  const node = new FakeElement(tagName);
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
