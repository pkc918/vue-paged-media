<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
import "vue-paged-media/style.css";
import data from "../public/data.json";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ top: 15, right: 10, bottom: 15, left: 10 }">
    <section v-for="(html, index) in data" :key="index" v-html="html" />
  </VuePagedMedia>
</template>
