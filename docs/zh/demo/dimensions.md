<script setup>
import DimensionsCustom from "../../examples/DimensionsCustom.vue";
import DimensionsPreset from "../../examples/DimensionsPreset.vue";
</script>

# Dimensions

## 预设尺寸

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>预设尺寸</span>
    <span>dimensions="A4"</span>
  </div>
  <div class="vpm-demo__stage">
    <DimensionsPreset />
  </div>
</div>

### 代码

<<< ../../examples/DimensionsPreset.vue

## 自定义尺寸

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>自定义尺寸</span>
    <span>:dimensions="{ width, height }"</span>
  </div>
  <div class="vpm-demo__stage">
    <DimensionsCustom />
  </div>
</div>

### 代码

<<< ../../examples/DimensionsCustom.vue
