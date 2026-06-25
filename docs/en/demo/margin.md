<script setup>
import MarginAxis from "../../examples/MarginAxis.vue";
import MarginSides from "../../examples/MarginSides.vue";
</script>

# Margin

## Axis Margin

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Axis Margin</span>
    <span>:margin="{ x, y }"</span>
  </div>
  <div class="vpm-demo__stage">
    <MarginAxis />
  </div>
</div>

### Code

<<< ../../examples/MarginAxis.vue

## Four-side Margin

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Four-side Margin</span>
    <span>:margin="{ top, right, bottom, left }"</span>
  </div>
  <div class="vpm-demo__stage">
    <MarginSides />
  </div>
</div>

### Code

<<< ../../examples/MarginSides.vue
