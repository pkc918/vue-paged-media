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
  const contentHeight = content.scrollHeight;
  if (contentWidth <= 0 || contentHeight <= 0) return;

  const nextScale = Math.min(
    1,
    viewport.clientWidth / contentWidth,
    getAvailableHeight(viewport) / contentHeight,
  );
  scale.value = nextScale;
  height.value = contentHeight * nextScale;
}

function getAvailableHeight(viewport: HTMLElement) {
  const parent = viewport.parentElement;
  if (!parent) return Number.POSITIVE_INFINITY;

  const siblingsHeight = Array.from(parent.children).reduce((total, child) => {
    if (child === viewport || !(child instanceof HTMLElement)) return total;

    const style = window.getComputedStyle(child);
    return (
      total + child.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
    );
  }, 0);

  return Math.max(1, parent.clientHeight - siblingsHeight);
}

onMounted(() => {
  void nextTick(updateScale);

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(updateScale);
    if (viewportRef.value) resizeObserver.observe(viewportRef.value);
    if (contentRef.value) resizeObserver.observe(contentRef.value);
    if (viewportRef.value?.parentElement) resizeObserver.observe(viewportRef.value.parentElement);
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
  display: flex;
  justify-content: center;
  max-width: 100%;
  overflow: hidden;
  width: 100%;
}

.fit-preview__content {
  transform-origin: top center;
  width: max-content;
}

.fit-preview__content :deep(.vue-paged-media) {
  max-width: none !important;
  overflow: visible !important;
}
</style>
