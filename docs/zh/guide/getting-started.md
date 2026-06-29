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
import { ref } from "vue";
import { VuePagedMedia, type VuePagedMediaInstance } from "vue-paged-media";
import "vue-paged-media/style.css";

const paged = ref<VuePagedMediaInstance | null>(null);
</script>

<template>
  <button type="button" @click="paged?.print()">打印</button>

  <VuePagedMedia ref="paged" dimensions="A4" :margin="{ x: 18, y: 24 }" :corner="8">
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

| 名称            | 类型                                                                                       | 说明                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `dimensions`    | `"A4" \| "B5" \| { width: number; height: number }`                                        | 页面尺寸，单位为毫米。                                                                   |
| `margin`        | `{ x: number; y: number } \| { top: number; right: number; bottom: number; left: number }` | 页边距，单位为毫米。                                                                     |
| `column`        | `number`                                                                                   | 每页内容栏数，默认 `1`。                                                                 |
| `columnGap`     | `number`                                                                                   | 栏间距，单位为毫米，默认 `6`。                                                           |
| `columnRule`    | `boolean \| string \| CSSProperties`                                                       | 栏间竖线。传 `true` 使用默认竖线，传字符串或样式对象可自定义。                           |
| `blocks`        | `string[]`                                                                                 | 需要尽量保持整体分页的 class 选择器，例如 `[".keep-together"]`。                         |
| `corner`        | `number`                                                                                   | 角标方形尺寸，单位为毫米；四边插槽厚度使用同一个值；未使用页边插槽时不占用空间。         |
| `pageFlow`      | `"x" \| "y"`                                                                               | 页面预览排列方向。`x` 表示按行从左到右排页；`y` 表示按列从上到下排页，默认 `y`。         |
| `pageFlowCount` | `number`                                                                                   | `pageFlow="x"` 时表示每行页数，`pageFlow="y"` 时表示每列页数；不传时保持连续单行或单列。 |

## 打印页面

组件实例暴露了 `print(): Promise<void>` 方法。调用后会把当前分页后的页面内容写入隐藏打印文档，并打开浏览器的系统打印窗口；打印内容只包含 `.vue-paged-media__page` 页面，不会包含预览页之外的其它应用界面。

## 分页内容

默认插槽里的顶层节点会作为内容块参与分页。Fragment 会被展开；文本形式的 HTML 会作为一个块处理；如果文本内容是 JSON 字符串数组，则会拆成多个 HTML 块。

当内容块超过当前页剩余高度时，组件会尝试拆分文本和嵌套节点。

如果有些元素希望尽量保持整体分页，可以使用 `blocks`：

```vue
<VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }" :blocks="['.keep-together']">
  <section class="keep-together">
    <h2>摘要</h2>
    <p>这个 section 能放进空白栏时，会整体移动到下一栏或下一页。</p>
  </section>
</VuePagedMedia>
```

命中 `blocks` 的元素如果能放进一个空白栏，就不会被拆分；如果它本身高于一栏可用内容高度，也会先从下一栏或下一页开始，再回退到普通拆分规则，保证分页能继续。图片有独立规则：当图片高度或宽度超出一栏可用内容区域时，会先从下一栏或下一页开始，再按对应方向缩小到栏内，并保持宽高比自适应。

设置 `column` 后，每页会按指定栏数分割内容区域。内容会先填充当前栏，当前栏满后进入下一栏；当前页所有栏都满后，再进入下一页第一栏。`columnGap` 会参与单栏宽度计算，`columnRule` 只控制栏间竖线样式，不影响分页测量。

## 排页方式

使用 `pageFlow` 和 `pageFlowCount` 可以控制外层预览容器中的页面排列方式：

```vue
<VuePagedMedia page-flow="x" :page-flow-count="2" dimensions="A4" :margin="{ x: 18, y: 24 }">
  <article>...</article>
</VuePagedMedia>
```

`pageFlow="x"` 表示从左到右横向排页，`pageFlowCount` 控制每行页数。`pageFlow="y"` 表示从上到下纵向排页，`pageFlowCount` 控制每列页数。不传 `pageFlowCount` 时，会保持连续单行或单列。

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

## 查看 Demo

进入 [Demo 集合](/zh/demo/) 可以直接查看 paged media 分页预览效果和对应源码。
