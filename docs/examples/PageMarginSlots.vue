<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
import "vue-paged-media/style.css";
import data from "../public/data.json";
</script>

<template>
  <VuePagedMedia
    dimensions="A4"
    :margin="{ top: 4, right: 4, bottom: 4, left: 4 }"
    :column="2"
    :column-gap="6"
    column-rule
    :corner="8"
  >
    <template #header="{ pageNumber }">
      <div class="page-margin-demo__header">
        <span>hello vue-paged-media</span>
        <span>Page {{ pageNumber }}</span>
      </div>
    </template>

    <template #footer="{ pageNumber, pageCount }">
      <div class="page-margin-demo__footer">{{ pageNumber }} / {{ pageCount }}</div>
    </template>

    <template #left="{ index }">
      <div class="page-margin-demo__side page-margin-demo__side--left">
        vue-paged-media {{ index + 1 }}
      </div>
    </template>

    <template #right="{ index }">
      <div class="page-margin-demo__side page-margin-demo__side--right">
        paged preview {{ index + 1 }}
      </div>
    </template>

    <template #top-left-corner>
      <div class="page-margin-demo__corner page-margin-demo__corner--top-left">TL</div>
    </template>

    <template #top-right-corner>
      <div class="page-margin-demo__corner page-margin-demo__corner--top-right">TR</div>
    </template>

    <template #bottom-left-corner>
      <div class="page-margin-demo__corner page-margin-demo__corner--bottom-left">BL</div>
    </template>

    <template #bottom-right-corner>
      <div class="page-margin-demo__corner page-margin-demo__corner--bottom-right">BR</div>
    </template>

    <section v-for="(html, index) in data" :key="index" v-html="html" />
  </VuePagedMedia>
</template>

<style scoped>
.page-margin-demo__header {
  align-items: center;
  background: #eff6ff;
  box-sizing: border-box;
  color: #334155;
  display: flex;
  font-size: 10px;
  height: 100%;
  justify-content: space-between;
  padding: 0 4mm;
  width: 100%;
}

.page-margin-demo__footer {
  align-items: center;
  background: #f0fdf4;
  box-sizing: border-box;
  color: #475569;
  display: flex;
  font-size: 10px;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.page-margin-demo__side {
  align-items: center;
  color: #64748b;
  display: flex;
  font-size: 9px;
  height: 100%;
  justify-content: center;
  letter-spacing: 0;
  width: 100%;
  writing-mode: vertical-rl;
}

.page-margin-demo__side--left {
  background: #fefce8;
}

.page-margin-demo__side--right {
  background: #f8fafc;
}

.page-margin-demo__corner {
  align-items: center;
  background: #fff7ed;
  box-sizing: border-box;
  color: #475569;
  display: flex;
  font-size: 8px;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.page-margin-demo__corner--top-left {
  background: #fdf2f8;
}

.page-margin-demo__corner--top-right {
  background: #f5f3ff;
}

.page-margin-demo__corner--bottom-left {
  background: #ecfeff;
}

.page-margin-demo__corner--bottom-right {
  background: #f7fee7;
}
</style>
