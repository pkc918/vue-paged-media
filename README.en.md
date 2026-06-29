# vue-paged-media

**English** | [简体中文](./README.zh-CN.md)

A Vue 3 component for previewing paged media pagination in the browser. It measures real DOM content against page dimensions and margins, then renders the paginated result as page previews.

## Installation

```sh
# vp
vp add vue-paged-media
# npm
npm install vue-paged-media
# pnpm
pnpm add vue-paged-media
# yarn
yarn add vue-paged-media
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from "vue";
import { VuePagedMedia, type VuePagedMediaInstance } from "vue-paged-media";
import "vue-paged-media/style.css";

const paged = ref<VuePagedMediaInstance | null>(null);
</script>

<template>
  <button type="button" @click="paged?.print()">Print</button>

  <VuePagedMedia ref="paged" dimensions="A4" :margin="{ x: 18, y: 24 }" :corner="8">
    <template #header="{ index }">Header for page {{ index + 1 }}</template>
    <template #footer="{ pageNumber, pageCount }">{{ pageNumber }} / {{ pageCount }}</template>
    <template #top-left-corner>TL</template>
    <template #top-right-corner>TR</template>
    <template #bottom-left-corner>BL</template>
    <template #bottom-right-corner>BR</template>

    <article>
      <h1>hello vue-paged-media</h1>
      <p>Place the Vue content you want to preview as paged media here.</p>
    </article>

    <section>
      <h2>Details</h2>
      <p>Each top-level VNode is treated as a content block.</p>
    </section>
  </VuePagedMedia>
</template>
```

## Props

| Prop         | Type                                                                                       | Description                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `dimensions` | `"A4" \| "B5" \| { width: number; height: number }`                                        | Page size in mm.                                                                                                                     |
| `margin`     | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | Page margins in mm.                                                                                                                  |
| `column`     | `number`                                                                                   | Number of text columns per page.                                                                                                     |
| `columnGap`  | `number`                                                                                   | Gap between columns in mm.                                                                                                           |
| `columnRule` | `boolean \| string \| CSSProperties`                                                       | Vertical rule between columns. `true` uses the default style.                                                                        |
| `blocks`     | `string[]`                                                                                 | CSS class selectors, such as `[".keep-together"]`, for elements that should stay together while they can fit on an empty page.       |
| `corner`     | `number`                                                                                   | Corner square size in mm. The side slot thickness uses the same value. It does not reserve space when no page margin slots are used. |

## Printing

The component instance exposes `print(): Promise<void>`. Calling it writes the current paginated pages into a hidden print document and opens the browser system print dialog. Only `.vue-paged-media__page` nodes are printed, so surrounding application UI is excluded.

## Page Margin Slots

The component can render repeated page headers, footers, side content, and corner marks on each page edge. These slots do not participate in content pagination measurement. The four corner marks are fixed squares sized by `corner`, and the header, footer, left, and right slots use the same value as their thickness. Together they form one connected page-edge area. Each page is composed from the page margin slot area and a body content container. `margin` is applied only inside that body container and represents the distance between body content and the inner edge of the page margin slots. When no page margin slots are used, `margin` represents the distance between body content and the page edge.

| Slot                  | Area                      |
| --------------------- | ------------------------- |
| `header`              | Top page margin center    |
| `footer`              | Bottom page margin center |
| `left`                | Left page margin center   |
| `right`               | Right page margin center  |
| `top-left-corner`     | Top-left corner mark      |
| `top-right-corner`    | Top-right corner mark     |
| `bottom-left-corner`  | Bottom-left corner mark   |
| `bottom-right-corner` | Bottom-right corner mark  |

Each page margin slot receives `{ index, pageNumber, pageCount }`; `index` starts at `0`.

## How It Works

Top-level nodes in the default slot become content blocks. Fragments are expanded inline; HTML strings are treated as single blocks. When a block overflows the remaining page height, the component splits text nodes via binary search and recursively splits element trees, rebuilding ancestor wrappers around the split content.

Elements matching `blocks` selectors are treated as keep-together blocks: if the element can fit in an empty column, it moves as a whole to the next column or page instead of splitting. If it is taller than an empty column, it starts in the next column or page first, then splits normally so content can continue.

Images that exceed the page height or width are scaled down to fit the available page area while preserving their aspect ratio.

## Documentation

Visit [the docs site](https://pkc918.github.io/vue-paged-media/) for guides, demos, and examples.
