<script setup>
import DimensionsPreset from "../../examples/DimensionsPreset.vue";
</script>

# Demo Gallery

This section collects paged media pagination previews for different `vue-paged-media` props. Each demo page shows the paginated page result and the matching usage code.

## Try Printing

Click the “打印 / Print” button in the example below to send the current paginated pages to the system print dialog.

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Print current paginated content</span>
    <span>paged?.print()</span>
  </div>
  <div class="vpm-demo__stage">
    <DimensionsPreset />
  </div>
</div>

## Demo

- [Dimensions](/en/demo/dimensions): preset size and custom size usage.
- [Margin](/en/demo/margin): axis margin and four-side margin usage.
- [Column](/en/demo/column): multi-column pagination on each page.
- [Blocks](/en/demo/blocks): keep-together blocks from `data.json` and generated image fitting.
- [Page Margin Slots](/en/demo/page-margin-slots): page headers, footers, sides, and corner marks.
