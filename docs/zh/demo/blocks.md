<script setup>
import BlocksKeepTogether from "../../examples/BlocksKeepTogether.vue";
</script>

# Blocks

使用 `blocks` 可以传入需要尽量保持整体分页的 class 选择器。这个 Demo 继续使用 `data.json`，在默认插槽循环渲染时给每个外层 `section` 添加对应 class，并保留一张生成的超高图片来展示图片缩放效果。

命中的 section 如果能放进一个空白栏，就会整体移动到下一栏或下一页。如果它本身高于一栏可用内容高度，也会先从下一栏或下一页开始，再按普通规则继续拆分。生成图片也遵循同样的下一栏优先规则，再按高度或宽度缩小到栏内。

## 单栏

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>不可拆分块</span>
    <span>:blocks="['.keep-together', '.split-when-too-tall']"</span>
  </div>
  <div class="vpm-demo__stage">
    <BlocksKeepTogether />
  </div>
</div>

## 双栏

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>分栏中的不可拆分块</span>
    <span>:column="2" :blocks="['.keep-together', '.split-when-too-tall']"</span>
  </div>
  <div class="vpm-demo__stage">
    <BlocksKeepTogether :columns="2" />
  </div>
</div>

## 代码

<<< ../../examples/BlocksKeepTogether.vue
