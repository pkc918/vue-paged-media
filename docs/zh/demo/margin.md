<script setup>
import MarginAxis from "../../examples/MarginAxis.vue";
import MarginSides from "../../examples/MarginSides.vue";
</script>

# Margin

## 轴向页边距

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>轴向页边距</span>
    <span>:margin="{ x, y }"</span>
  </div>
  <div class="vpm-demo__stage">
    <MarginAxis />
  </div>
</div>

### 代码

<<< ../../examples/MarginAxis.vue

## 四边页边距

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>四边页边距</span>
    <span>:margin="{ top, right, bottom, left }"</span>
  </div>
  <div class="vpm-demo__stage">
    <MarginSides />
  </div>
</div>

### 代码

<<< ../../examples/MarginSides.vue
