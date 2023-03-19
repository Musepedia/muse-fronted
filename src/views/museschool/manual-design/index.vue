<script lang="ts" setup>
import GeneralComponent from "@/views/museschool/components/generalComponent.vue"
import { onMounted, onUnmounted, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { Component } from "museschool"
import { useMuseschoolStore } from "@/store/modules/museschool"

const router = useRouter()

const museschoolStore = useMuseschoolStore()

//组件引用
const designZone = ref(null)

//gridlayout列数，行高
const colNum = ref(50)
const rowHeight = ref(10)

const chosenComponent = ref(-1) //当前选择的组件index
const editComponent = reactive([false, false]) //右侧编辑区域显示内容，index对应原型组件列表，例如若[1]为ture，右侧显示图片组件的编辑区域

const changingTitle = ref(false)

//表单绑定，通过watch监视修改componentList中的对应部分
const title = ref("研学手册标题")
const textContent = ref("")
const fontSize = ref(16)
const fontWeightOptions = reactive([
  { value: "bold", label: "Bold" },
  { value: "bolder", label: "Bolder" },
  { value: "lighter", label: "Lighter" },
  {
    value: "normal",
    label: "normal"
  }
])
const fontWeight = ref("")
const fontColor = ref("#000000")
const backgroundColor = ref("#FFFFFF")
const imgURL = ref("")

const mouseXY = { x: 0, y: 0 } //监测鼠标位置

//添加组件应修改
//1.generalComponent
//2.prototypeComponentList原型组件列表
//3.该组件的右侧编辑区域（html&表单绑定）
//4.选择组件变化监听中的switch
//5.监听表单变化
//6.添加组件函数中的switch

//原型组件列表
const prototypeComponentList = reactive([
  {
    i: "-1",
    type: "0",
    componentProps: { content: "文本组件", background: "#ffffff" }
  },
  {
    i: "-2",
    type: "1",
    componentProps: {
      url: "https://northpicture.oss-cn-shanghai.aliyuncs.com/img/202302202247827.png",
      background: "#ffffff"
    }
  }
])

//组件列表
const componentList = museschoolStore.componentList

onMounted(() => {
  //若componentList为空，尝试从本地存储获取数据
  if (componentList.length == 0) {
    const storedComponentList = JSON.parse(localStorage.getItem("componentList")!)
    if (storedComponentList) {
      for (let i = 0; i < storedComponentList.length; i++) {
        componentList.push(storedComponentList[i])
      }
    }
  }

  //添加鼠标位置监听器
  document.addEventListener(
    "dragover",
    function (e) {
      mouseXY.x = e.clientX
      mouseXY.y = e.clientY
    },
    false
  )
  //添加unload监听器，持续化存储componentList
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("componentList", JSON.stringify(componentList))
  })
})

onUnmounted(() => {
  //移除鼠标位置监听器
  document.removeEventListener(
    "dragover",
    function (e) {
      mouseXY.x = e.clientX
      mouseXY.y = e.clientY
    },
    false
  )
  //移除unload监听器
  window.removeEventListener("beforeunload", () => {
    localStorage.setItem("componentList", JSON.stringify(componentList))
  })
})

//监听选择组件变化
watch(chosenComponent, (newChosenComponent) => {
  //更改右侧编辑区域显示内容
  for (let i = 0; i < editComponent.length; i++) {
    editComponent[i] = false
  }
  editComponent[parseInt(componentList[newChosenComponent].type)] = true
  //修改表单placeholder
  switch (componentList[newChosenComponent].type) {
    case "0":
      textContent.value = componentList[newChosenComponent].componentProps?.content || ""
      fontSize.value = parseInt(componentList[newChosenComponent].componentProps?.fontSize || "16")
      fontWeight.value = componentList[newChosenComponent].componentProps?.fontWeight || "normal"
      fontColor.value = componentList[newChosenComponent].componentProps?.color || "#000000"
      backgroundColor.value = componentList[newChosenComponent].componentProps?.background || "#ffffff"
      break
    case "1":
      imgURL.value = componentList[newChosenComponent].componentProps?.url || ""
      backgroundColor.value = componentList[newChosenComponent].componentProps?.background || "#ffffff"
      break
  }
})

//监听表单变化
watch(textContent, (newTextContent) => {
  componentList[chosenComponent.value].componentProps!.content = newTextContent
})
watch(fontSize, (newFontSize) => {
  componentList[chosenComponent.value].componentProps!.fontSize = newFontSize.toString()
})
watch(fontWeight, (newFontWeight) => {
  componentList[chosenComponent.value].componentProps!.fontWeight = newFontWeight
})
watch(fontColor, (newFontColor) => {
  componentList[chosenComponent.value].componentProps!.color = newFontColor
})
watch(backgroundColor, (newBackgroundColor) => {
  componentList[chosenComponent.value].componentProps!.background = newBackgroundColor
})
watch(imgURL, (newImgURL) => {
  componentList[chosenComponent.value].componentProps!.url = newImgURL
})

//修改标题
function changeTitle() {
  changingTitle.value = !changingTitle.value
  if (!changingTitle.value) {
    museschoolStore.manualTitle = title
  }
}

//拖拽添加组件
function dragend(index: number) {
  const parentRect = (designZone.value as unknown as HTMLElement).getBoundingClientRect()

  if (
    mouseXY.x > parentRect.left &&
    mouseXY.x < parentRect.right &&
    mouseXY.y > parentRect.top &&
    mouseXY.y < parentRect.bottom
  ) {
    let componentProps = null
    switch (index) {
      case 0:
        componentProps = {
          content: "文本内容",
          fontSize: "16",
          fontWeight: "normal",
          color: "#000000",
          background: "#ffffff"
        }
        break
      case 1:
        componentProps = {
          url: "https://northpicture.oss-cn-shanghai.aliyuncs.com/img/202302202247827.png",
          background: "#ffffff"
        }
        break
    }

    let i: string
    if (componentList.length > 0) {
      i = (parseInt(componentList[componentList.length - 1].i) + 1).toString()
    } else {
      i = "1"
    }

    const component: Component = {
      i: i,
      x: Math.trunc((mouseXY.x - parentRect.left) / (parentRect.width / colNum.value)),
      y: Math.trunc((mouseXY.y - parentRect.top) / rowHeight.value),
      w: 10,
      h: 10,
      minW: 1,
      minH: 1,
      maxW: 20,
      maxH: 20,
      type: index.toString(),
      componentProps: componentProps
    }
    chosenComponent.value = componentList.length
    componentList.push(component)
  }
}

//删除组件
function deleteComponent(i: string) {
  // 移除数组中i==1的项
  const index = componentList.findIndex(function (item) {
    return item.i == i
  })
  if (chosenComponent.value == index) {
    chosenComponent.value = 0
  }
  if (index > -1) {
    componentList.splice(index, 1)
  }
}

//选择组件
function chooseComponent(i: string) {
  chosenComponent.value = componentList.findIndex(function (item) {
    return item.i == i
  })
}

//预览手册
function toManualPreview() {
  museschoolStore.componentList = componentList
  museschoolStore.designZoneWidth = (designZone.value as unknown as HTMLElement).getBoundingClientRect().width
  museschoolStore.exportManual = false
  router.push({ name: "manual-preview" })
}

//导出手册
function exportManual() {
  museschoolStore.componentList = componentList
  museschoolStore.designZoneWidth = (designZone.value as unknown as HTMLElement).getBoundingClientRect().width
  museschoolStore.exportManual = true
  router.push({ name: "manual-preview" })
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <div class="logo">
        <img alt="loading" src="@/assets/museschool/museschool.png" />
        <span>Museschool</span>
      </div>
      <!--      <div>undo-redo</div>-->
      <div class="title" @click="changeTitle">{{ title }}</div>
      <div v-if="changingTitle" class="titleForm">
        <el-input v-model="title" :placeholder="title" style="width: 70%" />
        <el-button color="#2565F1" @click="changeTitle">修改</el-button>
      </div>
      <div class="show-export">
        <el-button color="#2565F1" icon="Monitor" @click="toManualPreview">预览</el-button>
        <el-button color="#FFFFFF" icon="Download" @click="exportManual">导出</el-button>
      </div>
    </div>
    <div class="main">
      <div class="prototype-components">
        <div
          v-for="(item, index) in prototypeComponentList"
          :key="item.i"
          class="droppable-element"
          draggable="true"
          @dragend="dragend(index)"
        >
          <general-component
            :component-props="item.componentProps"
            :i="item.i"
            :showDelete="false"
            :type="item.type"
            style="background: transparent"
          />
        </div>
      </div>
      <div ref="designZone" class="design-zone">
        <grid-layout
          :col-num="colNum"
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
            :w="item.w"
            :x="item.x"
            :y="item.y"
            class="grid-item"
          >
            <general-component
              :component-props="item.componentProps"
              :i="item.i"
              :showDelete="true"
              :type="item.type"
              style="background: transparent"
              @delete-component="deleteComponent"
              @choose-component="chooseComponent"
            />
          </grid-item>
        </grid-layout>
      </div>
      <div class="props-editor">
        <div v-if="editComponent[0]" class="editor text-editor">
          <div class="editor-form">
            <span>文本内容：</span>
          </div>
          <div class="editor-form">
            <el-input v-model="textContent" :placeholder="textContent" autosize type="textarea" />
          </div>
          <div class="editor-form">
            <el-input-number
              v-model="fontSize"
              :placeholder="fontSize.toString()"
              :step-strictly="true"
              controls-position="right"
              style="margin-right: 5%"
            />
            <el-select v-model="fontWeight" :placeholder="fontWeight">
              <el-option v-for="item in fontWeightOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="editor-form">
            <div>
              <span>文本颜色：</span>
              <el-color-picker v-model="fontColor" show-alpha />
            </div>
            <div>
              <span>背景颜色：</span>
              <el-color-picker v-model="backgroundColor" show-alpha />
            </div>
          </div>
        </div>
        <div v-if="editComponent[1]" class="editor">
          <div class="editor-form">
            <span>URL：</span>
            <el-input v-model="imgURL" :placeholder="textContent" />
          </div>
          <div class="editor-form">
            <div>
              <span>背景颜色：</span>
              <el-color-picker v-model="backgroundColor" show-alpha />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  background: rgb(232, 233, 238);
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 0;

  .header {
    width: 100%;
    height: 8%;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    background: linear-gradient(270deg, rgba(121, 162, 254, 1), rgba(37, 101, 241, 1));
    box-shadow: 0 5px 6px rgba(0, 0, 0, 0.17);

    .logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      color: #ffffff;
      font-size: 29px;
      font-weight: bold;
      margin-left: 5%;

      img {
        height: 80%;
      }
    }

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #ffffff;
      font-size: 26px;
      font-weight: bold;
    }

    .titleForm {
      position: absolute;
      top: 1%;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 30%;
      height: 6%;
      background: white;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
    }

    .show-export {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 5%;
    }
  }

  .main {
    width: 100%;
    height: 92%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .prototype-components {
      width: 25%;
      height: 100%;
      background: rgb(74, 80, 94);
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      align-items: center;

      .droppable-element {
        width: 60%;
        margin-top: 5%;
      }
    }

    .design-zone {
      width: 55%;
      height: 96%;
      border-radius: 5px;
      margin-top: 1%;
      background: #ffffff;
      overflow-y: scroll;
    }

    .props-editor {
      width: 18%;
      height: 100%;
      background: #ffffff;
      overflow-y: scroll;

      .editor {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #b9b9b9;

        .editor-form {
          width: 80%;
          margin-top: 5%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
