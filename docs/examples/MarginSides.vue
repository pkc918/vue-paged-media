<script setup lang="ts">
import { VuePagedMedia } from "vue-paged-media";
</script>

<template>
  <VuePagedMedia dimensions="A4" :margin="{ top: 24, right: 18, bottom: 28, left: 18 }">
    <section>
      <h1>Four-side margin</h1>
      <p>Use top, right, bottom, and left when each side needs its own value.</p>
    </section>
  </VuePagedMedia>
</template>
