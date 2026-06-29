<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
import "vue-paged-media/style.css";
import data from "../public/data.json";
</script>

<template>
  <VuePagedMedia
    dimensions="A4"
    :margin="{ x: 10, y: 12 }"
    :column="2"
    :column-gap="8"
    column-rule="0.2mm solid #d1d5db"
  >
    <section v-for="(html, index) in data" :key="index" v-html="html" />
  </VuePagedMedia>
</template>
