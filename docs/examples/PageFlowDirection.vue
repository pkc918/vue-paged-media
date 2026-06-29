<script setup lang="ts">
import { ref } from "vue";
import { VuePagedMedia, type PageFlow } from "vue-paged-media";
import "vue-paged-media/style.css";
import data from "../public/data.json";
import FitPreview from "./FitPreview.vue";

const flow = ref<PageFlow>("x");
</script>

<template>
  <div class="page-flow-controls">
    <button
      class="page-flow-controls__button"
      :class="{ 'page-flow-controls__button--active': flow === 'x' }"
      type="button"
      @click="flow = 'x'"
    >
      x
    </button>
    <button
      class="page-flow-controls__button"
      :class="{ 'page-flow-controls__button--active': flow === 'y' }"
      type="button"
      @click="flow = 'y'"
    >
      y
    </button>
  </div>

  <FitPreview>
    <VuePagedMedia dimensions="A4" :margin="{ x: 4, y: 4 }" :page-flow="flow">
      <section v-for="(html, index) in data" :key="index" v-html="html" />
    </VuePagedMedia>
  </FitPreview>
</template>

<style scoped>
.page-flow-controls {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  display: flex;
  gap: 2px;
  justify-content: center;
  margin: 0 auto 16px;
  padding: 3px;
  width: max-content;
}

.page-flow-controls__button {
  background: transparent;
  border: 0;
  border-radius: 4px;
  color: #374151;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  min-width: 32px;
  padding: 8px 10px;
}

.page-flow-controls__button:hover {
  background: #ffffff;
}

.page-flow-controls__button--active {
  background: #111827;
  color: #ffffff;
}

.page-flow-controls__button--active:hover {
  background: #111827;
}
</style>
