<script setup>
import DimensionsPreset from "../../examples/DimensionsPreset.vue";
</script>

# Demo 集合

这里收集 `vue-paged-media` 不同 props 下的 paged media 分页预览效果。每个 Demo 页面都会同时展示分页后的页面效果和对应使用代码。

## 打印体验

点击下面示例中的“打印 / Print”按钮，可以直接把当前分页页面送入系统打印。

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>打印当前分页内容</span>
    <span>paged?.print()</span>
  </div>
  <div class="vpm-demo__stage">
    <DimensionsPreset />
  </div>
</div>

## Demo

- [Dimensions](/zh/demo/dimensions)：展示预设尺寸和自定义尺寸两种写法。
- [Margin](/zh/demo/margin)：展示轴向页边距和四边页边距两种写法。
- [Column](/zh/demo/column)：展示每页多栏分页的写法。
- [排页方式](/zh/demo/page-flow)：展示预览容器按 x/y 方向排列页面。
- [Blocks](/zh/demo/blocks)：用 `data.json` 和生成图片展示不可拆分块与图片缩放。
- [页边插槽](/zh/demo/page-margin-slots)：展示页眉、页脚、侧边和四个角标的写法。
