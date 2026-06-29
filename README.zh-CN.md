# vue-paged-media

[English](./README.md) | **简体中文**

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
  <VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }" :corner="8">
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

| 参数            | 类型                                                                                       | 默认值  | 说明                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------- |
| `dimensions`    | `"A4" \| "B5" \| { width: number; height: number }`                                        | —       | 页面尺寸，单位 mm。                                                                      |
| `margin`        | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | —       | 页边距，单位 mm。                                                                        |
| `column`        | `number`                                                                                   | `1`     | 单页文字列数。                                                                           |
| `columnGap`     | `number`                                                                                   | `6`     | 列间距，单位 mm。                                                                        |
| `columnRule`    | `boolean \| string \| CSSProperties`                                                       | `false` | 列间竖线样式，`true` 使用默认样式。                                                      |
| `blocks`        | `string[]`                                                                                 | `[]`    | 需要尽量保持整体分页的 class 选择器，例如 `[".keep-together"]`。                         |
| `corner`        | `number`                                                                                   | `8`     | 角标方形尺寸，单位 mm；四边插槽厚度使用同一个值；未使用页边插槽时不占用空间。            |
| `pageFlow`      | `"x" \| "y"`                                                                               | `"y"`   | 页面预览排列方向。`x` 表示按行从左到右排页；`y` 表示按列从上到下排页。                   |
| `pageFlowCount` | `number`                                                                                   | —       | `pageFlow="x"` 时表示每行页数，`pageFlow="y"` 时表示每列页数；不传时保持连续单行或单列。 |

## 打印

组件实例暴露了 `print(): Promise<void>` 方法。调用后会把当前分页后的页面内容写入隐藏打印文档，并打开浏览器的系统打印窗口；打印内容只包含 `.vue-paged-media__page` 页面，不会包含预览页之外的其它应用界面。

## pageFlow

使用 `pageFlow` 控制页面预览方向：

```vue
<VuePagedMedia page-flow="x" dimensions="A4" :margin="{ x: 18, y: 24 }">
  ...
</VuePagedMedia>
```

## pageFlowCount

使用 `pageFlowCount` 控制每组展示的页数：

```vue
<VuePagedMedia :page-flow-count="2" dimensions="A4" :margin="{ x: 18, y: 24 }">
  ...
</VuePagedMedia>
```

## 页边插槽

组件支持在每一页的纸张边缘渲染页眉、页脚、侧边内容和四个角标，这些插槽不会参与正文分页测量。四个角标是固定方形，尺寸由 `corner` 控制；页眉、页脚、左侧和右侧插槽使用同一个值作为厚度，并共同组成一圈互相贴合的页边区域。每页由页边插槽区域和正文 container 共同组成纸张大小，`margin` 只在正文 container 内部生效，表示正文内容与页边插槽内侧之间的距离。未使用页边插槽时，`margin` 表示正文内容与纸张边缘之间的距离。

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

## 分页规则

默认插槽中的顶层节点会成为内容块。Fragment 会被展开，HTML 字符串会作为单个内容块。内容超出当前页剩余高度时，组件会用二分查找拆分文本节点，并递归拆分元素树，同时保留拆分内容的祖先结构。

命中 `blocks` 选择器的元素会被视为不可拆分块：如果它能放进一个空白栏，就会整体移动到下一栏或下一页；如果它本身高于一栏可用内容高度，也会先从下一栏或下一页开始，再按普通规则拆分，保证分页可以继续。

图片如果高度或宽度超出一页可用内容区域，会按对应方向缩小到页内，并保持宽高比自适应。

## 文档

访问[文档站点](https://pkc918.github.io/vue-paged-media/)查看指南、Demo 和示例。
