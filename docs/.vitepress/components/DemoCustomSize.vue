<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";

const props = withDefaults(defineProps<{ lang?: "zh" | "en" }>(), {
  lang: "zh",
});

const text = {
  zh: {
    title: "自定义纸张",
    meta: "58mm x 96mm, 四边页边距",
    heading: "交付清单",
    itemA: "分页组件",
    itemB: "打印预览",
    itemC: "文档 Demo",
    noteTitle: "说明",
    note: "这个例子使用自定义毫米尺寸和四边页边距，适合票据、标签、小卡片等布局。",
  },
  en: {
    title: "Custom Page Size",
    meta: "58mm x 96mm, four-side margins",
    heading: "Delivery List",
    itemA: "Pagination component",
    itemB: "Print preview",
    itemC: "Documentation demos",
    noteTitle: "Note",
    note: "This demo uses a custom millimeter size and explicit margins, useful for receipts, labels, and cards.",
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
      <VuePagedMedia
        :dimensions="{ width: 58, height: 96 }"
        :margin="{ top: 7, right: 5, bottom: 7, left: 5 }"
      >
        <article class="vpm-demo__receipt">
          <h1>{{ text.heading }}</h1>
          <p>NO. VPM-2026-0624</p>
        </article>

        <section class="vpm-demo__receipt">
          <div class="vpm-demo__receipt-row">
            <span>{{ text.itemA }}</span>
            <span>1</span>
          </div>
          <div class="vpm-demo__receipt-row">
            <span>{{ text.itemB }}</span>
            <span>1</span>
          </div>
          <div class="vpm-demo__receipt-row">
            <span>{{ text.itemC }}</span>
            <span>3</span>
          </div>
        </section>

        <section class="vpm-demo__receipt">
          <h2>{{ text.noteTitle }}</h2>
          <p>{{ text.note }}</p>
        </section>
      </VuePagedMedia>
    </div>
  </div>
</template>
