<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { Component } from "museschool"
import GeneralComponent from "../components/generalComponent.vue"
import { useMuseschoolStore } from "@/store/modules/museschool"

const museschoolStore = useMuseschoolStore()

const componentList: Component[] = reactive([])

//gridlayout列数，行高
const colNum = ref(100) //应该根据设计页面的等比例放大，保证显示效果一致性
const rowHeight = ref(10) //应该根据设计页面的等比例放大，保证显示效果一致性

onMounted(() => {
  for (let i = 0; i < museschoolStore.componentList.length; i++) {
    componentList.push(museschoolStore.componentList[i])
  }
})
</script>

<template>
  <div class="app-container">
    <grid-layout
      ref="gridlayout"
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
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 0;

  .vue-grid-layout {
    width: 100%;
    height: 100%;
  }
}
</style>
