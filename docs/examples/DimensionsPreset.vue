<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }">
    <section>
      <h1>Preset dimensions</h1>
      <p>Use a built-in page size by passing the preset name.</p>
    </section>
  </VuePagedMedia>
</template>
