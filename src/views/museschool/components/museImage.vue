<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue"

/* 传入参数相关 ********************************************************************************************/
//图片组件参数格式
// componentProps: { url: "", background: ""}
const props = defineProps(["componentProps"])
const componentStyle: Ref<string> = ref("") //组件样式

//监听props变化
watch(props, () => {
  componentStyle.value = ""
  //解析componentProps
  if (props.componentProps.background != null) {
    componentStyle.value = componentStyle.value + "background:" + props.componentProps.background + ";"
  }
})

/* 生命周期钩子 ********************************************************************************************/
onMounted(() => {
  //解析componentProps
  if (props.componentProps.background != null) {
    componentStyle.value = componentStyle.value + "background:" + props.componentProps.background + ";"
  }
})
</script>

<template>
  <div :style="componentStyle" class="muse-image">
    <el-image :src="props.componentProps.url" class="image" />
  </div>
</template>

<style lang="scss" media="print" scoped>
.muse-image {
  width: 100%;
  height: 100%;

  .image {
    width: 100%;
  }
}
</style>
