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

  <VuePagedMedia ref="paged" dimensions="A4" :margin="{ x: 4, y: 4 }">
    <section v-for="(html, index) in data" :key="index" v-html="html" />
  </VuePagedMedia>
</template>
