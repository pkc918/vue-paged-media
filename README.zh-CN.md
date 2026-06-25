# vue-paged-media

## 语言

- [English](./README.md)
- [简体中文](./README.zh-CN.md)

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
import "vue-paged-media/style.css";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }" :page-margin-slot-size="8">
    <template #header="{ index }">第 {{ index + 1 }} 页页眉</template>
    <template #footer="{ pageNumber, pageCount }">{{ pageNumber }} / {{ pageCount }}</template>
    <template #top-left-corner>密</template>
    <template #top-right-corner>报</template>
    <template #bottom-left-corner>左下角标</template>
    <template #bottom-right-corner>右下角标</template>

    <article>
      <h1>hello vue-paged-media</h1>
      <p>这里放入需要分页预览的 Vue 内容。</p>
    </article>

    <section>
      <h2>明细</h2>
      <p>每个顶层 VNode 会作为一个内容块参与分页。</p>
    </section>
  </VuePagedMedia>
</template>
```

## Props

| 参数                 | 类型                                                                                       | 默认值  | 说明                                                |
| -------------------- | ------------------------------------------------------------------------------------------ | ------- | --------------------------------------------------- |
| `dimensions`         | `"A4" \| "B5" \| { width: number; height: number }`                                        | —       | 页面尺寸，单位 mm。                                 |
| `margin`             | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | —       | 页边距，单位 mm。                                   |
| `column`             | `number`                                                                                   | `1`     | 单页文字列数。                                      |
| `columnGap`          | `number`                                                                                   | `6`     | 列间距，单位 mm。                                   |
| `columnRule`         | `boolean \| string \| CSSProperties`                                                       | `false` | 列间竖线样式，`true` 使用默认样式。                 |
| `pageMarginSlotSize` | `number`                                                                                   | `8`     | 页边插槽厚度，单位 mm；未使用页边插槽时不占用空间。 |

## 页边插槽

组件支持在每一页的纸张边缘渲染页眉、页脚、侧边内容和四个角标，这些插槽不会参与正文分页测量。四边和四角会组成一圈互相贴合的页边区域，厚度由 `pageMarginSlotSize` 控制。每页由页边插槽区域和正文 container 共同组成纸张大小，`margin` 只在正文 container 内部生效，表示正文内容与页边插槽内侧之间的距离。未使用页边插槽时，`margin` 表示正文内容与纸张边缘之间的距离。

| 插槽名                | 区域           |
| --------------------- | -------------- |
| `header`              | 顶部页边距中间 |
| `footer`              | 底部页边距中间 |
| `left`                | 左侧页边距中间 |
| `right`               | 右侧页边距中间 |
| `top-left-corner`     | 左上角标       |
| `top-right-corner`    | 右上角标       |
| `bottom-left-corner`  | 左下角标       |
| `bottom-right-corner` | 右下角标       |

每个页边插槽都会收到 `{ index, pageNumber, pageCount }`，其中 `index` 从 `0` 开始。

## 文档

访问[文档站点](https://pkc918.github.io/vue-paged-media/)查看指南、Demo 和示例。
