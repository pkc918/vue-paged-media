# vue-paged-media

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
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }">
    <article>
      <h1>Quarterly Report</h1>
      <p>Content that needs paged preview goes here.</p>
    </article>

    <section>
      <h2>Details</h2>
      <p>Each top-level VNode is treated as a content block.</p>
    </section>
  </VuePagedMedia>
</template>
```

## Props

| Prop         | Type                                                                                       | Description         |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------- |
| `dimensions` | `"A4" \| "B5" \| { width: number; height: number }`                                        | Page size in mm.    |
| `margin`     | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | Page margins in mm. |

## How It Works

Top-level nodes in the default slot become content blocks. Fragments are expanded inline; HTML strings are treated as single blocks. When a block overflows the remaining page height, the component splits text nodes via binary search and recursively splits element trees, rebuilding ancestor wrappers around the split content.

A single unsplittable element taller than one page is placed on one page and allowed to overflow so pagination can finish.

## Documentation

Visit [the docs site](https://pkc918.github.io/vue-paged-media/) for guides, demos, and examples.
