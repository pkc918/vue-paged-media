<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const scale = ref(1);
const height = ref(0);

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

function updateScale() {
  const viewport = viewportRef.value;
  const content = contentRef.value;
  if (!viewport || !content) return;

  const contentWidth = content.scrollWidth;
  if (contentWidth <= 0) return;

  const nextScale = Math.min(1, viewport.clientWidth / contentWidth);
  scale.value = nextScale;
  height.value = content.scrollHeight * nextScale;
}

onMounted(() => {
  void nextTick(updateScale);

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(updateScale);
    if (viewportRef.value) resizeObserver.observe(viewportRef.value);
    if (contentRef.value) resizeObserver.observe(contentRef.value);
  }

  if (typeof MutationObserver !== "undefined" && contentRef.value) {
    mutationObserver = new MutationObserver(updateScale);
    mutationObserver.observe(contentRef.value, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
});
</script>

<template>
  <div ref="viewportRef" class="fit-preview" :style="{ height: `${height}px` }">
    <div ref="contentRef" class="fit-preview__content" :style="{ transform: `scale(${scale})` }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fit-preview {
  max-width: 100%;
  overflow: hidden;
}

.fit-preview__content {
  transform-origin: top left;
  width: max-content;
}

.fit-preview__content :deep(.vue-paged-media) {
  max-width: none !important;
  overflow: visible !important;
}
</style>
