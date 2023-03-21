<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue"
import GeneralComponent from "../components/generalComponent.vue"
import { useMuseschoolStore } from "@/store/modules/museschool"
import { getComponentList } from "@/utils/cache/localStorage"

const museschoolStore = useMuseschoolStore()

//组件引用
const manual = ref(null)

//组件列表
const componentList = museschoolStore.componentList

//gridlayout列数，行高
const colNum = ref(50) //应该根据设计页面的等比例放大，保证显示效果一致性
const rowHeight = ref(10) //应该根据设计页面的等比例放大，保证显示效果一致性

onMounted(() => {
  if (componentList.length == 0) {
    const storedComponentList = getComponentList()
    if (storedComponentList) {
      for (let i = 0; i < storedComponentList.length; i++) {
        componentList.push(storedComponentList[i])
      }
    }
  }

  //监听页面窗口大小变化
  window.addEventListener("resize", handleResize)

  //计算行高
  rowHeight.value =
    10 * ((manual.value as unknown as HTMLElement).getBoundingClientRect().width / museschoolStore.designZoneWidth)

  //直接导出
  if (museschoolStore.exportManual) {
    setTimeout(() => {
      window.print()
    }, 1000)
  }
})

onUnmounted(() => {
  //移除事件监听器
  window.removeEventListener("resize", handleResize)
})

//监听页面窗口大小变化，重新计算行高
function handleResize() {
  rowHeight.value =
    10 * ((manual.value as unknown as HTMLElement).getBoundingClientRect().width / museschoolStore.designZoneWidth)
}

//导出手册
function exportManual() {
  window.print()
}
</script>

<template>
  <div class="app-container">
    <div class="export">
      <el-button color="#2565F1" icon="Download" @click="exportManual">导出</el-button>
    </div>
    <div ref="manual" class="manual">
      <grid-layout
        :col-num="colNum"
        :isDraggable="false"
        :isResizable="false"
        :layout="componentList"
        :margin="[0, 0]"
        :preventCollision="true"
        :row-height="rowHeight"
        :verticalCompact="false"
        class="vue-grid-layout"
      >
        <grid-item
          v-for="item in componentList"
          :key="item.i"
          :h="item.h"
          :i="item.i"
          :max-h="item.maxH"
          :max-w="item.maxW"
          :min-h="item.minH"
          :min-w="item.minW"
          :static="true"
          :w="item.w"
          :x="item.x"
          :y="item.y"
          class="grid-item"
        >
          <general-component
            :component-props="item.componentProps"
            :i="item.i"
            :showDelete="false"
            :type="item.type"
            style="background: transparent"
          />
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media print {
  .export {
    display: none;
  }
}

.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 0;

  .export {
    position: fixed;
    top: 5%;
    right: 5%;
    z-index: 1000;
  }

  .manual {
    width: 100%;
    height: 100%;

    .vue-grid-layout {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
