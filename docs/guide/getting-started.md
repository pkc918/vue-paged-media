# Getting Started

`vue-paged-media` is a Vue 3 component for previewing paged media pagination. It measures the real DOM rendered from the default slot with the given page size and margins, then renders the calculated pagination result as page previews.

## Installation

::: code-group

```sh [vp]
$ vp add vue-paged-media
```

```sh [npm]
$ npm install vue-paged-media
```

```sh [pnpm]
$ pnpm add vue-paged-media
```

```sh [yarn]
$ yarn add vue-paged-media
```

:::

## Preview Pagination

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
      <p>Put the content that needs paged preview here.</p>
    </article>

    <section>
      <h2>Details</h2>
      <p>Each top-level VNode participates in pagination as a content block.</p>
    </section>
  </VuePagedMedia>
</template>
```

## Props

| Name         | Type                                                                                       | Description                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `dimensions` | `"A4" \| "B5" \| { width: number; height: number }`                                        | Page size in millimeters.                                                                                                                     |
| `margin`     | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | Page margins in millimeters.                                                                                                                  |
| `column`     | `number`                                                                                   | Number of content columns on each page. Defaults to `1`.                                                                                      |
| `columnGap`  | `number`                                                                                   | Gap between columns in millimeters. Defaults to `6`.                                                                                          |
| `columnRule` | `boolean \| string \| CSSProperties`                                                       | Divider between columns. Pass `true` for the default divider, or pass a string or style object to customize it.                               |
| `blocks`     | `string[]`                                                                                 | Class selectors for elements that should stay together while they can fit on an empty page, such as `[".keep-together"]`.                     |
| `corner`     | `number`                                                                                   | Corner square size in millimeters. The side slot thickness uses the same value. It does not reserve space when no page margin slots are used. |

## Print Pages

The component instance exposes `print(): Promise<void>`. Calling it writes the current paginated pages into a hidden print document and opens the browser system print dialog. Only `.vue-paged-media__page` nodes are printed, so surrounding application UI is excluded.

## Pagination Content

Top-level nodes in the default slot are treated as content blocks. Fragments are expanded; HTML text is treated as one block; if the text is a JSON string array, it is split into multiple HTML blocks.

When a content block does not fit into the remaining page height, the component tries to split text and nested nodes.

Use `blocks` when some elements should stay together during pagination:

```vue
<VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }" :blocks="['.keep-together']">
  <section class="keep-together">
    <h2>Summary</h2>
    <p>This section moves to the next column or page as a whole when it can fit there.</p>
  </section>
</VuePagedMedia>
```

Elements matching `blocks` are not split if they can fit in an empty column. If a matched element is taller than the available content height of one column, it starts in the next column or page first, then falls back to normal splitting so pagination can continue. Images have a separate rule: when an image exceeds the column height or width, it starts in the next column or page first, then scales down to fit the available area while preserving its aspect ratio.

When `column` is set, each page content area is split into that many columns. Content fills the current column first, continues in the next column when it is full, and moves to the first column of the next page after all columns on the current page are full. `columnGap` participates in column width calculation, while `columnRule` only controls the divider style and does not affect pagination measurement.

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

## View Demos

Open the [Demo Gallery](/demo/) to see paged media pagination previews and matching source code.
