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

| 名称                 | 类型                                                                                       | 说明                                                           |
| -------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `dimensions`         | `"A4" \| "B5" \| { width: number; height: number }`                                        | 页面尺寸，单位为毫米。                                         |
| `margin`             | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | 页边距，单位为毫米。                                           |
| `column`             | `number`                                                                                   | 每页内容栏数，默认 `1`。                                       |
| `columnGap`          | `number`                                                                                   | 栏间距，单位为毫米，默认 `6`。                                 |
| `columnRule`         | `boolean \| string \| CSSProperties`                                                       | 栏间竖线。传 `true` 使用默认竖线，传字符串或样式对象可自定义。 |
| `pageMarginSlotSize` | `number`                                                                                   | 页边插槽厚度，单位为毫米；未使用页边插槽时不占用空间。         |

## 分页内容

默认插槽里的顶层节点会作为内容块参与分页。Fragment 会被展开；文本形式的 HTML 会作为一个块处理；如果文本内容是 JSON 字符串数组，则会拆成多个 HTML 块。

当内容块超过当前页剩余高度时，组件会尝试拆分文本和嵌套节点。单个不可拆分元素超过一页时，会作为溢出块放入单页，避免分页流程卡住。

设置 `column` 后，每页会按指定栏数分割内容区域。内容会先填充当前栏，当前栏满后进入下一栏；当前页所有栏都满后，再进入下一页第一栏。`columnGap` 会参与单栏宽度计算，`columnRule` 只控制栏间竖线样式，不影响分页测量。

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

## 查看 Demo

进入 [Demo 集合](/zh/demo/) 可以直接查看 paged media 分页预览效果和对应源码。
