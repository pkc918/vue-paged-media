# vue-paged-media

## Languages

- [English](./README.md)
- [简体中文](./README.zh-CN.md)

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
import { VuePagedMedia } from "vue-paged-media";
import "vue-paged-media/style.css";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }" :page-margin-slot-size="8">
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

| Prop                 | Type                                                                                       | Description                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `dimensions`         | `"A4" \| "B5" \| { width: number; height: number }`                                        | Page size in mm.                                                                                |
| `margin`             | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | Page margins in mm.                                                                             |
| `pageMarginSlotSize` | `number`                                                                                   | Page margin slot thickness in mm. It does not reserve space when no page margin slots are used. |

## Page Margin Slots

The component can render repeated page headers, footers, side content, and corner marks on each page edge. These slots do not participate in content pagination measurement. The four sides and corners form one connected page-edge area, with thickness controlled by `pageMarginSlotSize`. Each page is composed from the page margin slot area and a body content container. `margin` is applied only inside that body container and represents the distance between body content and the inner edge of the page margin slots. When no page margin slots are used, `margin` represents the distance between body content and the page edge.

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

A single unsplittable element taller than one page is placed on one page and allowed to overflow so pagination can finish.

## Documentation

Visit [the docs site](https://pkc918.github.io/vue-paged-media/) for guides, demos, and examples.
