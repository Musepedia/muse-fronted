<script lang="ts" setup>
import { onMounted, onUnmounted, Ref, ref } from "vue"
import GeneralComponent from "../components/GeneralComponent.vue"
import { useMuseschoolStore } from "@/store/modules/museschool"
import { getManual } from "@/utils/cache/localStorage"
import { MuseManual } from "museschool"

const museschoolStore = useMuseschoolStore()

/* 组件渲染相关 ********************************************************************************************/
const manualRef = ref<HTMLInputElement | null>(null) //清单组件引用
const thisManual: MuseManual = museschoolStore.manual //本页面的研学手册

//gridlayout列数，行高
const colNum: Ref<number> = ref(50) //应该根据设计页面的等比例放大，保证显示效果一致性
const rowHeight: Ref<number> = ref(10) //应该根据设计页面的等比例放大，保证显示效果一致性
const pageHeight: Ref<string> = ref(";height:800px") //页面高度

//导出为PDF
function exportManual() {
  console.log("export")
}

/* 生命周期钩子 ********************************************************************************************/
onMounted(() => {
  //若manual为空或者id为默认值，尝试从本地存储获取数据
  if ((thisManual.pages.length == 1 && thisManual.pages[0].componentList.length == 0) || thisManual.id == -1) {
    const storedManual = getManual()
    thisManual.id = storedManual.id
    thisManual.title = storedManual.title
    thisManual.pages = storedManual.pages
  }
  resizeHandler() //计算行高、页高
  window.addEventListener("resize", resizeHandler) //添加页面窗口大小监听器
  //直接导出
  if (museschoolStore.exportManual) {
    setTimeout(() => {
      exportManual()
    }, 1000)
  }
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler) //移除页面窗口大小监听器
})

//监听页面窗口大小变化，重新计算行高、页高
function resizeHandler() {
  const pageWidth = (manualRef.value as unknown as HTMLElement).getBoundingClientRect().width * 0.96
  if (thisManual.ratio) {
    pageHeight.value = ";height:" + (pageWidth * Math.sqrt(2)).toString() + "px"
  } else {
    pageHeight.value = ";height:" + (pageWidth * (1 / Math.sqrt(2))).toString() + "px"
  }
  rowHeight.value = pageWidth / colNum.value
}
</script>

<template>
  <div class="muse-preview">
    <div class="export">
      <el-button color="#2565F1" icon="Download" @click="exportManual">导出</el-button>
    </div>
    <div ref="manualRef" class="manual">
      <div
        v-for="(page, pageIndex) in thisManual.pages"
        :key="pageIndex"
        :style="page.pageInfo.background + pageHeight"
        class="muse-page"
      >
        <grid-layout
          v-model:layout="page.componentList"
          :col-num="colNum"
          :margin="[0, 0]"
          :prevent-collision="true"
          :row-height="rowHeight"
          :vertical-compact="false"
          class="vue-grid-layout"
        >
          <grid-item
            v-for="(item, componentIndex) in page.componentList"
            :key="componentIndex"
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
  </div>
</template>

<style lang="scss" scoped>
@media print {
  .export {
    display: none;
  }
}

.muse-preview {
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

    .muse-page {
      position: relative;
      left: 2%;
      width: 96%;
      border-radius: 5px;
      margin-top: 15px;

      .page-edit-btn-container {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 8%;
        height: 2%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        color: rgb(200, 200, 200);
        cursor: pointer;
        z-index: 10;
      }

      .vue-grid-layout {
        width: 100%;
        height: 700px;
      }
    }
  }
}
</style>
