<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
import "vue-paged-media/style.css";
import data from "../public/data.json";

withDefaults(
  defineProps<{
    columns?: number;
  }>(),
  {
    columns: 1,
  },
);

const blockClasses = ["normal-flow", "split-when-too-tall", "keep-together"];
const tallImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 720'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop stop-color='%23f97316'/%3E%3Cstop offset='1' stop-color='%230f766e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='720' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='54' fill='%23fff7ed' opacity='.8'/%3E%3Cpath d='M48 240h144v300H48z' fill='%23ffffff' opacity='.72'/%3E%3Cpath d='M72 284h96M72 330h96M72 376h96M72 422h96M72 468h96' stroke='%230f172a' stroke-width='10' stroke-linecap='round' opacity='.45'/%3E%3C/svg%3E";
</script>

<template>
  <VuePagedMedia
    dimensions="A4"
    :margin="{ x: 4, y: 4 }"
    :column="columns"
    :column-gap="8"
    :column-rule="(columns as number) > 1 ? '0.2mm solid #cbd5e1' : false"
    :blocks="['.keep-together', '.split-when-too-tall']"
  >
    <section
      v-for="(html, index) in data"
      :key="index"
      class="demo-block"
      :class="blockClasses[index]"
      :data-block-class="`.${blockClasses[index]}`"
      v-html="html"
    />

    <section class="demo-block image-fit" data-block-class=".image-fit">
      <img
        :src="tallImage"
        alt="Tall generated page sample"
        style="width: 160mm; height: 360mm; object-fit: cover"
      />
    </section>
  </VuePagedMedia>
</template>

<style scoped>
.demo-block {
  position: relative;
  box-sizing: border-box;
  padding: 8mm 7mm 6mm;
  border: 0.25mm solid #d6dee8;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: #172033;
}

.demo-block::before {
  display: inline-block;
  margin: 0 0 4mm;
  padding: 1mm 2mm;
  border-radius: 2mm;
  background: #172033;
  color: #ffffff;
  content: attr(data-block-class);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  line-height: 1.2;
}

.normal-flow {
  border-color: #94a3b8;
  background: #f8fafc;
}

.keep-together {
  border-color: #0f766e;
  background: #effcf7;
}

.split-when-too-tall {
  border-color: #c2410c;
  background: #fff7ed;
}

.image-fit {
  padding: 0;
  border-color: #64748b;
  background: #f8fafc;
}

.image-fit::before {
  content: none;
}

.image-fit img {
  display: block;
}
</style>
