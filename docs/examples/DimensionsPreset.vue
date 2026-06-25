<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
import data from "../public/data.json";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ x: 4, y: 4 }">
    <section v-for="(html, index) in data" :key="index" v-html="html" />
  </VuePagedMedia>
</template>
