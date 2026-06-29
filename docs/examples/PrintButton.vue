<script setup lang="ts">
defineEmits<{
  click: [];
}>();
</script>

<template>
  <div class="print-button-wrap">
    <button class="print-button" type="button" @click="$emit('click')">打印 / Print</button>
  </div>
</template>

<style scoped>
.print-button-wrap {
  display: flex;
  justify-content: center;
  margin: 0 0 16px;
}

.print-button {
  align-items: center;
  background: #111827;
  border: 1px solid #111827;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  justify-content: center;
  line-height: 1;
  margin: 0;
  min-height: 36px;
  padding: 0 14px;
}

.print-button:hover {
  background: #374151;
  border-color: #374151;
}

.print-button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
</style>
