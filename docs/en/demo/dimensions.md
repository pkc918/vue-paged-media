<script setup>
import DimensionsCustom from "../../examples/DimensionsCustom.vue";
import DimensionsPreset from "../../examples/DimensionsPreset.vue";
</script>

# Dimensions

## Preset Size

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Preset Size</span>
    <span>dimensions="A4"</span>
  </div>
  <div class="vpm-demo__stage">
    <DimensionsPreset />
  </div>
</div>

### Code

<<< ../../examples/DimensionsPreset.vue

## Custom Size

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Custom Size</span>
    <span>:dimensions="{ width, height }"</span>
  </div>
  <div class="vpm-demo__stage">
    <DimensionsCustom />
  </div>
</div>

### Code

<<< ../../examples/DimensionsCustom.vue
