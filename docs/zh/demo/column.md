<script setup>
import ColumnTwo from "../../examples/ColumnTwo.vue";
</script>

# Column

`column` 用来设置每页的内容栏数。多栏时，内容会先填充当前栏；当前栏满后进入下一栏；当前页所有栏都满后，再进入下一页第一栏。

`columnGap` 控制栏间距，单位为毫米，默认 `6`。`columnRule` 控制栏之间的竖线，可以传 `true` 使用默认竖线，也可以传 CSS border 字符串或样式对象自定义。

## 双栏

<div class="vpm-demo">
  <div class="vpm-demo__bar">
    <span>双栏排版</span>
    <span>:column="2" :column-gap="8"</span>
  </div>
  <div class="vpm-demo__stage">
    <ColumnTwo />
  </div>
</div>

### 代码

<<< ../../examples/ColumnTwo.vue
