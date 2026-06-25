<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
</script>

<template>
  <VuePagedMedia :dimensions="{ width: 148, height: 210 }" :margin="{ x: 14, y: 18 }">
    <section>
      <h1>Custom dimensions</h1>
      <p>Use millimeter values when you need a custom page size.</p>
    </section>
  </VuePagedMedia>
</template>
