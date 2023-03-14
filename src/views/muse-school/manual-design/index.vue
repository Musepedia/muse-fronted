<script lang="ts" setup>
import GeneralComponent from "@/views/muse-school/components/generalComponent.vue"
import { onMounted, reactive, ref } from "vue"

const gridlayout = ref(null)

//原型组件列表
const prototypeComponentList = reactive([
  {
    i: "-1",
    type: "0",
    componentProps: { content: "原型" }
  },
  { i: "-2", type: "1", componentProps: {} }
])

//gridlayout列数，行高
const colNum = ref(50)
const rowHeight = ref(10)

//组件列表
const componentList = reactive([
  {
    i: "1",
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    minW: 10,
    minH: 10,
    maxW: 20,
    maxH: 20,
    type: "0",
    componentProps: { content: "文本内容" }
  },
  { i: "2", x: 0, y: 4, w: 10, h: 10, minW: 5, minH: 5, maxW: 20, maxH: 20, type: "1", componentProps: {} }
])

//监测鼠标位置
const zero = 0
const mouseXY = { x: zero, y: zero }

onMounted(() => {
  //添加鼠标位置监听器
  document.addEventListener(
    "dragover",
    function (e) {
      mouseXY.x = e.clientX
      mouseXY.y = e.clientY
    },
    false
  )
})

function dragend() {
  console.log("dragend")
  const element = document.getElementById("design-zone")
  console.log(element)
  if (element !== null) {
    const parentRect = element.getBoundingClientRect()
    let mouseInGrid = false
    if (
      mouseXY.x > parentRect.left &&
      mouseXY.x < parentRect.right &&
      mouseXY.y > parentRect.top &&
      mouseXY.y < parentRect.bottom
    ) {
      mouseInGrid = true
    }
    if (mouseInGrid) {
      const x = Math.trunc((mouseXY.x - parentRect.left) / (parentRect.width / colNum.value))
      let y = Math.trunc((mouseXY.y - parentRect.top) / rowHeight.value)
      if (y > 1) {
        y--
      }
      console.log(x, "   ", y)
      componentList.push({
        i: (Number(componentList[componentList.length - 1].i) + 1).toString(),
        x: x,
        y: y,
        w: 10,
        h: 10,
        minW: 10,
        minH: 10,
        maxW: 20,
        maxH: 20,
        type: "0",
        componentProps: {}
      })
    }
  }
}
</script>

<template>
  <div class="app-container">
    <el-card class="prototype-components">
      <div
        v-for="item in prototypeComponentList"
        :key="item.i"
        class="droppable-element"
        draggable="true"
        @drag="drag"
        @dragend="dragend"
      >
        <general-component :component-props="item.componentProps" :i="item.i" :type="item.type" />
      </div>
    </el-card>
    <el-card id="design-zone">
      <grid-layout
        ref="gridlayout"
        v-model:layout="componentList"
        :col-num="colNum"
        :is-draggable="true"
        :is-resizable="true"
        :row-height="rowHeight"
        :use-css-transforms="true"
        :vertical-compact="false"
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
          :w="item.w"
          :x="item.x"
          :y="item.y"
          class="grid-item"
        >
          <general-component :component-props="item.componentProps" :i="item.i" :type="item.type" />
        </grid-item>
      </grid-layout>
    </el-card>
    <el-card class="props-modification">修改参数</el-card>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-around;

  .prototype-components {
    width: 20%;
    height: 100%;
    background: #fafafa;
    overflow-y: scroll;
  }

  #design-zone {
    width: 58%;
    height: 100%;
    background: #fafafa;
    overflow-y: scroll;
  }

  .props-modification {
    width: 20%;
    height: 100%;
    background: #fafafa;
    overflow-y: scroll;
  }
}
</style>
