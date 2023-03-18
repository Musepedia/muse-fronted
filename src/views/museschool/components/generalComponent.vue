<script lang="ts" setup>
import { computed, markRaw, ref } from "vue"
import museText from "./museText.vue"
import museImage from "./museImage.vue"
import { Close } from "@element-plus/icons-vue"

const props = defineProps(["showDelete", "i", "type", "componentProps"])

//已开发的组件列表，此数组的索引即为组件的type字段
const componentList = markRaw([museText, museImage])
const currentComponent = computed(() => {
  return componentList[props.type]
})

//是否可以显示删除按钮
const showDelete = ref(false)

//显示删除按钮
function showDeleteBtn() {
  if (props.showDelete) {
    showDelete.value = true
  }
}

//隐藏删除按钮
function hideDeleteBtn() {
  showDelete.value = false
}
</script>

<template>
  <div class="app-container" @mouseenter="showDeleteBtn" @mouseleave="hideDeleteBtn">
    <component
      :is="currentComponent"
      :componentProps="props.componentProps"
      :i="props.i"
      class="the-component"
      @click="$emit('chooseComponent', props.i)"
    />
    <Close
      v-if="showDelete"
      style="width: 1em; height: 1em; position: absolute; top: 0; right: 0; color: rgb(200, 200, 200)"
      @click="$emit('deleteComponent', props.i)"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
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
