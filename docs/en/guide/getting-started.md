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
import { VuePagedMedia } from "vue-paged-media";
import "vue-paged-media/style.css";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }">
    <article>
      <h1>Quarterly Report</h1>
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

| Name         | Type                                                                                       | Description                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `dimensions` | `"A4" \| "B5" \| { width: number; height: number }`                                        | Page size in millimeters.                                                                                       |
| `margin`     | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | Page margins in millimeters.                                                                                    |
| `column`     | `number`                                                                                   | Number of content columns on each page. Defaults to `1`.                                                        |
| `columnGap`  | `number`                                                                                   | Gap between columns in millimeters. Defaults to `6`.                                                            |
| `columnRule` | `boolean \| string \| CSSProperties`                                                       | Divider between columns. Pass `true` for the default divider, or pass a string or style object to customize it. |

## Pagination Content

Top-level nodes in the default slot are treated as content blocks. Fragments are expanded; HTML text is treated as one block; if the text is a JSON string array, it is split into multiple HTML blocks.

When a content block does not fit into the remaining page height, the component tries to split text and nested nodes. A single unsplittable element that is taller than one page is placed on one page and allowed to overflow so pagination can finish.

When `column` is set, each page content area is split into that many columns. Content fills the current column first, continues in the next column when it is full, and moves to the first column of the next page after all columns on the current page are full. `columnGap` participates in column width calculation, while `columnRule` only controls the divider style and does not affect pagination measurement.

## View Demos

Open the [Demo Gallery](/en/demo/) to see paged media pagination previews and matching source code.
