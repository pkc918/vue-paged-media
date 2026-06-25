# vue-paged-media

一个 Vue 3 组件，用于在浏览器中预览 paged media 分页效果。组件根据页面尺寸和页边距测量真实 DOM 内容，再将分页结果渲染为页面预览。

## 安装

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

## 快速开始

```vue
<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }">
    <article>
      <h1>季度报告</h1>
      <p>这里放入需要分页预览的正文内容。</p>
    </article>

    <section>
      <h2>明细</h2>
      <p>每个顶层 VNode 会作为一个内容块参与分页。</p>
    </section>
  </VuePagedMedia>
</template>
```

## Props

| 参数         | 类型                                                                                       | 说明                |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------- |
| `dimensions` | `"A4" \| "B5" \| { width: number; height: number }`                                        | 页面尺寸，单位 mm。 |
| `margin`     | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | 页边距，单位 mm。   |

## 工作原理

默认插槽中的顶层节点会作为内容块参与分页。Fragment 会被展开；HTML 字符串作为单个块处理。当内容块超过当前页剩余高度时，组件通过二分查找拆分文本节点，并递归拆分元素树，在拆分内容周围重建祖先包装元素。

单个不可拆分元素超过一页时，会被放入单页并允许溢出，避免分页流程卡住。

## 文档

访问[文档站点](https://pkc918.github.io/vue-paged-media/)查看指南、Demo 和示例。
