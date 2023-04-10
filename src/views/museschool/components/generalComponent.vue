<script lang="ts" setup>
import { computed, markRaw, ref } from "vue"
import museText from "./museText.vue"
import museImage from "./museImage.vue"
import museAudio from "./museAudio.vue"
import { Close } from "@element-plus/icons-vue"

//组件参数
const props = defineProps(["showDelete", "i", "type", "componentProps"])

/* 渲染组件相关 ********************************************************************************************/
//添加组件应修改
//1.componentList 已开发的组件列表
//2.import

//已开发的组件列表，此数组的索引即为组件的type字段
const componentList = markRaw([museText, museImage, museAudio])
const currentComponent = computed(() => {
  return componentList[props.type]
})

/* 显示/隐藏删除按钮相关 ********************************************************************************************/
//是否可以显示删除按钮（原型组件不可删除）
const showDelete = ref(false)

//显示删除按钮
function showDeleteBtn() {
  if (props.showDelete) {
    showDelete.value = true
  }
}
</script>

<template>
  <div class="general-component" @mouseenter="showDeleteBtn" @mouseleave="showDelete = false">
    <component
      :is="currentComponent"
      :componentProps="props.componentProps"
      :i="props.i"
      class="the-component"
      @click="$emit('chooseComponent')"
    />
    <Close
      v-if="showDelete"
      style="width: 1em; height: 1em; position: absolute; top: 0; right: 0; color: rgb(200, 200, 200)"
      @click="$emit('deleteComponent')"
    />
  </div>
</template>

<style lang="scss" scoped>
.general-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;

  .the-component {
    width: 100%;
    height: 100%;
  }
}
</style>
