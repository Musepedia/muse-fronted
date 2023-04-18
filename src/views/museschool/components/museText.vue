<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue"

/* 传入参数相关 ********************************************************************************************/
//文本组件参数格式
// componentProps: { content: "", fontSize: "", fontWeight: "", color: "", background: ""}
const props = defineProps(["componentProps"])
const componentStyle: Ref<string> = ref("") //组件样式

//监听props变化
watch(props, () => {
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

/* 生命周期钩子 ********************************************************************************************/
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
</script>

<template>
  <div :style="componentStyle" class="muse-text">
    <text>{{ props.componentProps.content }}</text>
  </div>
</template>

<style lang="scss" media="print" scoped>
.muse-text {
  width: 100%;
  height: 100%;
}
</style>
