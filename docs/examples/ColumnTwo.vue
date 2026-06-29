<script setup lang="ts">
import { ref } from "vue";
import { VuePagedMedia, type VuePagedMediaInstance } from "vue-paged-media";
import "vue-paged-media/style.css";
import data from "../public/data.json";
import PrintButton from "./PrintButton.vue";

const paged = ref<VuePagedMediaInstance | null>(null);
</script>

<template>
  <PrintButton @click="paged?.print()" />

  <VuePagedMedia
    ref="paged"
    dimensions="A4"
    :margin="{ x: 10, y: 12 }"
    :column="2"
    :column-gap="8"
    column-rule="0.2mm solid #d1d5db"
  >
    <section v-for="(html, index) in data" :key="index" v-html="html" />
  </VuePagedMedia>
</template>
