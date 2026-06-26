<script setup>
import BlocksKeepTogether from "../examples/BlocksKeepTogether.vue";
</script>

# Blocks

Use `blocks` to pass class selectors for elements that should stay together during pagination. This demo reuses `data.json`, adds a class to each rendered `section` in the default slot, and keeps a generated tall image to show image fitting.

Matched sections move to the next column or page as a whole when they can fit in an empty column. If a matched section is taller than one column, it starts in the next column or page first, then splits normally. The generated image follows the same column-first rule before scaling down.

## Single Column

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Keep-together blocks</span>
    <span>:blocks="['.keep-together', '.split-when-too-tall']"</span>
  </div>
  <div class="vpm-demo__stage">
    <BlocksKeepTogether />
  </div>
</div>

## Two Columns

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Keep-together blocks in columns</span>
    <span>:column="2" :blocks="['.keep-together', '.split-when-too-tall']"</span>
  </div>
  <div class="vpm-demo__stage">
    <BlocksKeepTogether :columns="2" />
  </div>
</div>

## Code

<<< ../examples/BlocksKeepTogether.vue
