<script setup>
import PageMarginSlots from "../examples/PageMarginSlots.vue";
</script>

# Page Margin Slots

Page margin slots are repeated on each page edge. Use them for page headers, footers, side content, and corner marks. The four corner marks are fixed squares sized by `corner`, while the side slots use the same value as their thickness. Each page is composed from the page margin slot area and a body content container. `margin` is applied only inside that body container and represents the distance between body content and the inner edge of the page margin slots.

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>Page margin slots + body margin + columns</span>
    <span>margin: 4mm / corner: 8mm / column: 2</span>
  </div>
  <div class="vpm-demo__stage">
    <PageMarginSlots />
  </div>
</div>

## Code

<<< ../examples/PageMarginSlots.vue
