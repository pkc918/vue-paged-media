<script setup>
import PageMarginSlots from "../../examples/PageMarginSlots.vue";
</script>

# 页边插槽

页边插槽会在每一页的纸张边缘重复渲染，可用于页眉、页脚、左右侧边内容和四个角标。四边和四角会组成一圈互相贴合的页边区域，厚度由 `pageMarginSlotSize` 控制。每页由页边插槽区域和正文 container 共同组成纸张大小，`margin` 只在正文 container 内部生效，表示正文内容与页边插槽内侧之间的距离。

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>页边插槽 + 正文边距 + 多栏</span>
    <span>margin: 4mm / slot: 8mm / column: 2</span>
  </div>
  <div class="vpm-demo__stage">
    <PageMarginSlots />
  </div>
</div>

## 代码

<<< ../../examples/PageMarginSlots.vue
