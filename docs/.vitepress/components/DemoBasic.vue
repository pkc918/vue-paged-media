<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";

const props = withDefaults(defineProps<{ lang?: "zh" | "en" }>(), {
  lang: "zh",
});

const text = {
  zh: {
    title: "基础分页",
    meta: "80mm x 110mm, margin 8mm / 10mm",
    heading: "销售月报",
    intro: "本示例展示多个顶层内容块如何被组件放入同一个分页预览中。",
    metrics: "核心指标",
    rate: "目标完成率",
    customers: "新增客户",
    summary: "摘要",
    first: "市场活动带来了稳定线索，企业客户续费表现良好。",
    second: "下月重点是提升试用转化，并把交付文档沉淀为可复用模板。",
  },
  en: {
    title: "Basic Pagination",
    meta: "80mm x 110mm, margin 8mm / 10mm",
    heading: "Sales Report",
    intro:
      "This demo shows how multiple top-level content blocks are rendered into a paged preview.",
    metrics: "Key Metrics",
    rate: "Target rate",
    customers: "New customers",
    summary: "Summary",
    first: "Campaigns brought stable leads, and enterprise renewals performed well.",
    second: "Next month focuses on trial conversion and reusable delivery documentation.",
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
      <VuePagedMedia :dimensions="{ width: 80, height: 110 }" :margin="{ x: 8, y: 10 }">
        <article>
          <div class="vpm-demo__report-cover">
            <span class="vpm-demo__eyebrow">Monthly Brief</span>
            <h1>{{ text.heading }}</h1>
            <p>{{ text.intro }}</p>
          </div>
        </article>

        <section>
          <h2>{{ text.metrics }}</h2>
          <div class="vpm-demo__grid">
            <div class="vpm-demo__metric">
              <strong>128%</strong>
              <span>{{ text.rate }}</span>
            </div>
            <div class="vpm-demo__metric">
              <strong>42</strong>
              <span>{{ text.customers }}</span>
            </div>
          </div>
        </section>

        <section>
          <h2>{{ text.summary }}</h2>
          <p>{{ text.first }}</p>
          <p>{{ text.second }}</p>
        </section>
      </VuePagedMedia>
    </div>
  </div>
</template>
