<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ x: 18, y: 24 }">
    <section>
      <h1>Axis margin</h1>
      <p>Use x for left and right, and y for top and bottom.</p>
    </section>
  </VuePagedMedia>
</template>
