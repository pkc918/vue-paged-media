<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";

const props = withDefaults(defineProps<{ lang?: "zh" | "en" }>(), {
  lang: "zh",
});

const text = {
  zh: {
    title: "长内容跨页",
    meta: "90mm x 120mm, 自动拆分段落",
    heading: "排版说明",
    paragraphs: [
      "当一个内容块无法完整放进当前页时，组件会递归检查节点，并尝试把可容纳的部分留在当前页。",
      "文本节点会通过二分查找找到最大可放入长度，剩余文本会进入下一页。这样长段落可以自然跨页。",
      "如果元素内部包含标题、段落、列表等嵌套结构，组件会保留外层标签，并继续处理内部子节点。",
    ],
    useCases: "适用场景",
    items: [
      "合同、报告、说明书的打印预览。",
      "发票、票据、标签等固定纸张尺寸的布局检查。",
      "把业务系统里的结构化内容转换成可分页的页面预览。",
    ],
    notes: "注意事项",
    noteA: "分页依赖浏览器真实布局，请确保字体、字号、行高和内容宽度在预览时已经加载完成。",
    noteB: "单个不可拆分元素如果高度超过一整页，会被放入单页并允许溢出，以避免分页过程无法结束。",
  },
  en: {
    title: "Long Content",
    meta: "90mm x 120mm, automatic paragraph splitting",
    heading: "Pagination Notes",
    paragraphs: [
      "When a content block cannot fit into the remaining page height, the component recursively inspects nodes and keeps the fitting part on the current page.",
      "Text nodes use binary search to find the maximum fitting length. The remaining text moves to the next page, so long paragraphs can flow naturally.",
      "If an element contains nested headings, paragraphs, or lists, the outer tag is preserved while child nodes continue to be split.",
    ],
    useCases: "Use Cases",
    items: [
      "Print preview for contracts, reports, and manuals.",
      "Layout checks for invoices, receipts, labels, and fixed paper sizes.",
      "Transforming structured business content into paginated previews.",
    ],
    notes: "Notes",
    noteA:
      "Pagination depends on real browser layout, so fonts, font size, line height, and content width should be loaded before previewing.",
    noteB:
      "A single unsplittable element taller than one page is placed on one page and allowed to overflow so pagination can finish.",
  },
}[props.lang];
</script>

<template>
  <div class="vpm-demo">
    <div class="vpm-demo__bar">
      <span>{{ text.title }}</span>
      <span>{{ text.meta }}</span>
    </div>
    <div class="vpm-demo__stage">
      <VuePagedMedia :dimensions="{ width: 90, height: 120 }" :margin="{ x: 9, y: 10 }">
        <article>
          <span class="vpm-demo__eyebrow">Long Form</span>
          <h1>{{ text.heading }}</h1>
          <p v-for="paragraph in text.paragraphs" :key="paragraph">{{ paragraph }}</p>
          <h2>{{ text.useCases }}</h2>
          <ul>
            <li v-for="item in text.items" :key="item">{{ item }}</li>
          </ul>
          <h2>{{ text.notes }}</h2>
          <p>{{ text.noteA }}</p>
          <p>{{ text.noteB }}</p>
        </article>
      </VuePagedMedia>
    </div>
  </div>
</template>
