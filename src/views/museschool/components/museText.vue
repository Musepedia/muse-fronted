<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"

//文本组件参数格式
// componentProps: { content: "", fontSize: "", fontWeight: "", color: "", background: ""}
const props = defineProps(["i", "componentProps"])

//组件样式
const componentStyle = ref("")

onMounted(() => {
  //解析componentProps
  if (props.componentProps.fontSize != null) {
    componentStyle.value = componentStyle.value + "font-size:" + props.componentProps.fontSize + "px;"
  }
  if (props.componentProps.fontWeight != null) {
    componentStyle.value = componentStyle.value + "font-weight:" + props.componentProps.fontWeight + ";"
  }
  if (props.componentProps.color != null) {
    componentStyle.value = componentStyle.value + "color:" + props.componentProps.color + ";"
  }
  if (props.componentProps.background != null) {
    componentStyle.value = componentStyle.value + "background:" + props.componentProps.background + ";"
  }
})

//监听props变化
watch(props, async () => {
  componentStyle.value = ""
  //解析componentProps
  if (props.componentProps.fontSize != null) {
    componentStyle.value = componentStyle.value + "font-size:" + props.componentProps.fontSize + "px;"
  }
  if (props.componentProps.fontWeight != null) {
    componentStyle.value = componentStyle.value + "font-weight:" + props.componentProps.fontWeight + ";"
  }
  if (props.componentProps.color != null) {
    componentStyle.value = componentStyle.value + "color:" + props.componentProps.color + ";"
  }
  if (props.componentProps.background != null) {
    componentStyle.value = componentStyle.value + "background:" + props.componentProps.background + ";"
  }
})
</script>

<template>
  <div :style="componentStyle" class="app-container">
    <span>{{ props.componentProps.content }}</span>
  </div>
</template>

<style lang="scss" media="print" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
