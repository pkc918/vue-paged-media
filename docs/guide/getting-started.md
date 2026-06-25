# 快速开始

`vue-paged-media` 是一个 Vue 3 组件，用来预览 paged media 的分页效果。组件会根据纸张尺寸和页边距测量默认插槽中的真实 DOM 内容，再把计算后的分页结果渲染成页面预览。

## 安装

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

## 预览分页效果

```vue
<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
import "vue-paged-media/style.css";
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

| 名称         | 类型                                                                                       | 说明                   |
| ------------ | ------------------------------------------------------------------------------------------ | ---------------------- |
| `dimensions` | `"A4" \| "B5" \| { width: number; height: number }`                                        | 页面尺寸，单位为毫米。 |
| `margin`     | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | 页边距，单位为毫米。   |

## 分页内容

默认插槽里的顶层节点会作为内容块参与分页。Fragment 会被展开；文本形式的 HTML 会作为一个块处理；如果文本内容是 JSON 字符串数组，则会拆成多个 HTML 块。

当内容块超过当前页剩余高度时，组件会尝试拆分文本和嵌套节点。单个不可拆分元素超过一页时，会作为溢出块放入单页，避免分页流程卡住。

## 查看 Demo

进入 [Demo 集合](/demo/) 可以直接查看 paged media 分页预览效果和对应源码。
