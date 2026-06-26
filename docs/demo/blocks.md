<script setup>
import BlocksKeepTogether from "../examples/BlocksKeepTogether.vue";
</script>

# Blocks

Use `blocks` to pass class selectors for elements that should stay together during pagination. This demo reuses `data.json`, adds a class to each rendered `section` in the default slot, and keeps a generated tall image to show image fitting.

Matched sections move to the next page as a whole when they can fit on an empty page. If a matched section is taller than one page, it is split normally. The generated image is scaled down to fit inside one page.

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Keep-together blocks</span>
    <span>:blocks="['.keep-together', '.split-when-too-tall']"</span>
  </div>
  <div class="vpm-demo__stage">
    <BlocksKeepTogether />
  </div>
</div>

## Code

<<< ../examples/BlocksKeepTogether.vue
