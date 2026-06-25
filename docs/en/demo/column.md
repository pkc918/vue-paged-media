<script setup>
import ColumnTwo from "../../examples/ColumnTwo.vue";
</script>

# Column

Use `column` to set the number of content columns on each page. In multi-column mode, content fills the current column first, then continues in the next column. Once all columns on the page are full, content continues in the first column of the next page.

`columnGap` controls the gap between columns in millimeters and defaults to `6`. `columnRule` controls the vertical divider between columns. Pass `true` for the default divider, or pass a CSS border string or style object to customize it.

## Two Columns

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Two Columns</span>
    <span>:column="2" :column-gap="8"</span>
  </div>
  <div class="vpm-demo__stage">
    <ColumnTwo />
  </div>
</div>

### Code

<<< ../../examples/ColumnTwo.vue
