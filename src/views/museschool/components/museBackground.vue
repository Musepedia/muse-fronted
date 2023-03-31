<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"

/* 传入参数相关 ********************************************************************************************/
//背景组件参数格式
// componentProps: { url: "", background: ""}
const props = defineProps(["componentProps"])
const componentStyle = ref("") //组件样式

//监听props变化
watch(props, async () => {
  componentStyle.value = ""
  //解析componentProps
  if (props.componentProps.background != null) {
    componentStyle.value = componentStyle.value + "background:" + props.componentProps.background + ";"
  }
  if (props.componentProps.url != null) {
    componentStyle.value = componentStyle.value + 'background-image: url("' + props.componentProps.url + '");'
  }
})

/* 生命周期钩子 ********************************************************************************************/
onMounted(() => {
  //解析componentProps
  if (props.componentProps.background != null) {
    componentStyle.value = componentStyle.value + "background:" + props.componentProps.background + ";"
  }
  if (props.componentProps.url != null) {
    componentStyle.value = componentStyle.value + 'background-image: url("' + props.componentProps.url + '");'
  }
})
</script>

<template>
  <div :style="componentStyle" class="app-container" />
</template>

<style lang="scss" media="print" scoped>
.app-container {
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
