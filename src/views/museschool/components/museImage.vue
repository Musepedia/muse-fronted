<script lang="ts" setup>
import { onMounted, ref } from "vue"

//图片组件参数格式
// componentProps: { url: "", background: ""}
const props = defineProps(["i", "componentProps"])

//组件样式
const componentStyle = ref("")

onMounted(() => {
  //解析componentProps
  if (props.componentProps.background != null) {
    componentStyle.value = componentStyle.value + "background:" + props.componentProps.background + ";"
  }
})
</script>

<template>
  <div :style="componentStyle" class="app-container">
    <el-image :src="props.componentProps.url" class="image1" />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;

  .image1 {
    width: 100%;
  }
}
</style>
