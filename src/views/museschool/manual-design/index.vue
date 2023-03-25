<script lang="ts" setup>
import GeneralComponent from "../components/generalComponent.vue"
import { onMounted, onUnmounted, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { Component } from "museschool"
import { useMuseschoolStore } from "@/store/modules/museschool"
import { getComponentList, setComponentList } from "@/utils/cache/localStorage"
import { saveLocation } from "@/api/museschool"
import { ElMessage } from "element-plus"
import { Edit, MagicStick, Operation, Picture } from "@element-plus/icons-vue"
import SvgIcon from "@/components/SvgIcon/index.vue"
import museschool from "@/assets/museschool/museschool.png"

const router = useRouter()

const museschoolStore = useMuseschoolStore()

//组件引用
const designZone = ref(null)
const componentsTab0 = ref(null)
const componentsTab1 = ref(null)
const componentsTab2 = ref(null)
const componentsTab3 = ref(null)
const componentsTab4 = ref(null)
const componentsTabBr = ref(null)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const museschoolLogo = museschool

//gridlayout列数，行高
const colNum = ref(50)
const rowHeight = ref(10)

const chosenComponent = ref(-1) //当前选择的组件index

//切换编辑区域tab相关变量
const chosenEditorTab = ref(0)
const editorTabColor = "color: #6f6f6f;border-bottom: 1px solid #e4e4e4"
const activeEditorTabColor = "color: #326EF2;border-bottom: 1px solid #326EF2"

//切换组件区域tab相关变量
const chosenComponentsTab = ref(0)
const componentsTabColor = "color: #6f6f6f;background:#313338"
const activeComponentsTabColor = "color: #ffffff"

//表单绑定，通过watch监视修改componentList中的对应部分
const x = ref(1)
const y = ref(1)
const w = ref(10)
const h = ref(10)
const minW = ref(1)
const maxW = ref(20)
const minH = ref(1)
const maxH = ref(20)
const showTitleEditor = ref(false)
const title = ref("研学手册标题")
const showTextContentEditor = ref(false)
const textContent = ref("")
const showImgURLEditor = ref(false)
const imgURL = ref("")
const showFontSizeEditor = ref(false)
const fontSize = ref(16)
const showFontWeightEditor = ref(false)
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
const showFontColorEditor = ref(false)
const fontColor = ref("#000000")
const showBackgroundColorEditor = ref(false)
const backgroundColor = ref("#FFFFFF")

const mouseXY = { x: 0, y: 0 } //监测鼠标位置

//添加组件应修改
//1.generalComponent
//2.prototypeComponentList原型组件列表
//3.该组件的右侧编辑区域（html&表单绑定）
//4.选择组件变化监听中的switch(每个选项)
//5.监听表单变化
//6.添加组件函数中的switch

//原型组件列表
const prototypeComponentList = reactive([
  {
    i: "-1",
    type: 0,
    componentProps: { content: "文本组件", background: "#ffffff" }
  },
  {
    i: "-2",
    type: 1,
    componentProps: {
      url: "https://northpicture.oss-cn-shanghai.aliyuncs.com/img/202302202247827.png",
      background: "#ffffff"
    }
  }
])

const maxId = ref(1)

//组件列表
const componentList = museschoolStore.componentList

onMounted(() => {
  //若componentList为空，尝试从本地存储获取数据
  if (componentList.length == 0) {
    const storedComponentList = getComponentList()
    if (storedComponentList.length > 0) {
      maxId.value = parseInt(storedComponentList[storedComponentList.length - 1].i) + 1
      if (storedComponentList) {
        for (let i = 0; i < storedComponentList.length; i++) {
          componentList.push(storedComponentList[i])
        }
      }
    }
  } else {
    maxId.value = parseInt(componentList[componentList.length - 1].i) + 1
  }

  //计算行高
  resizeHandler()

  //默认为组件tab
  changeComponentsTab(0)

  //添加页面窗口大小监听器
  window.addEventListener("resize", resizeHandler)
  //添加鼠标位置监听器
  document.addEventListener("dragover", dragoverHandler)
  //添加unload监听器，持续化存储componentList
  window.addEventListener("beforeunload", beforeunloadHandler)
})

onUnmounted(() => {
  //持续化存储componentList
  setComponentList(componentList)

  //移除页面窗口大小监听器
  window.removeEventListener("resize", resizeHandler)
  //移除鼠标位置监听器
  document.removeEventListener("dragover", dragoverHandler)
  //移除unload监听器
  window.removeEventListener("beforeunload", beforeunloadHandler)
})

//监听选择组件变化
watch(chosenComponent, (newChosenComponent) => {
  chosenEditorTab.value = 0
  showTextContentEditor.value = false
  showFontSizeEditor.value = false
  showFontWeightEditor.value = false
  showFontColorEditor.value = false
  showImgURLEditor.value = false
  showBackgroundColorEditor.value = false
  if (newChosenComponent != -1) {
    x.value = componentList[newChosenComponent].x
    y.value = componentList[newChosenComponent].y
    w.value = componentList[newChosenComponent].w
    h.value = componentList[newChosenComponent].h
    minW.value = componentList[newChosenComponent].minW
    maxW.value = componentList[newChosenComponent].maxW
    minH.value = componentList[newChosenComponent].minH
    maxH.value = componentList[newChosenComponent].maxH
    //更改右侧编辑区域显示内容,修改表单placeholder
    switch (componentList[newChosenComponent].type) {
      case 0:
        showTextContentEditor.value = true
        textContent.value = componentList[newChosenComponent].componentProps?.content || ""
        showFontSizeEditor.value = true
        fontSize.value = parseInt(componentList[newChosenComponent].componentProps?.fontSize || "16")
        showFontWeightEditor.value = true
        fontWeight.value = componentList[newChosenComponent].componentProps?.fontWeight || "normal"
        showFontColorEditor.value = true
        fontColor.value = componentList[newChosenComponent].componentProps?.color || "#000000"
        showBackgroundColorEditor.value = true
        backgroundColor.value = componentList[newChosenComponent].componentProps?.background || "#ffffff"
        break
      case 1:
        showImgURLEditor.value = true
        imgURL.value = componentList[newChosenComponent].componentProps?.url || ""
        showBackgroundColorEditor.value = true
        backgroundColor.value = componentList[newChosenComponent].componentProps?.background || "#ffffff"
        break
    }
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
watch(x, (newX) => {
  componentList[chosenComponent.value].x = newX
})
watch(y, (newY) => {
  componentList[chosenComponent.value].y = newY
})
watch(w, (newW) => {
  componentList[chosenComponent.value].w = newW
})
watch(h, (newH) => {
  componentList[chosenComponent.value].h = newH
})
watch(minW, (newMinW) => {
  componentList[chosenComponent.value].minW = newMinW
})
watch(maxW, (newMaxW) => {
  componentList[chosenComponent.value].maxW = newMaxW
})
watch(minH, (newMinH) => {
  componentList[chosenComponent.value].minH = newMinH
})
watch(maxH, (newMaxH) => {
  componentList[chosenComponent.value].maxH = newMaxH
})

//unload之前持续化存储componentList
function beforeunloadHandler() {
  setComponentList(componentList)
}

//鼠标拖动组件时获取鼠标位置
function dragoverHandler(e: { clientX: number; clientY: number }) {
  mouseXY.x = e.clientX
  mouseXY.y = e.clientY
}

//监听页面窗口大小变化，重新计算行高
function resizeHandler() {
  rowHeight.value = (designZone.value as unknown as HTMLElement).getBoundingClientRect().width / colNum.value
}

//更改组件位置时同步修改表单值
function componentMoveHandler(i: string, newX: number, newY: number) {
  chooseComponent(i)
  x.value = newX
  y.value = newY
}

//更改组件大小时同步修改表单值
function componentResizeHandler(i: string, newW: number, newH: number) {
  w.value = newW
  h.value = newH
}

//修改标题
function changeTitle() {
  showTitleEditor.value = !showTitleEditor.value
  if (!showTitleEditor.value) {
    museschoolStore.manualTitle = title
  }
}

//拖拽添加组件
function addComponent(index: number) {
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

    const component: Component = {
      i: maxId.value.toString(),
      x: Math.trunc((mouseXY.x - parentRect.left) / (parentRect.width / colNum.value)),
      y: Math.trunc((mouseXY.y - parentRect.top) / rowHeight.value),
      w: 10,
      h: 10,
      minW: 1,
      minH: 1,
      maxW: 20,
      maxH: 20,
      type: index,
      componentProps: componentProps!
    }
    maxId.value++
    chosenComponent.value = componentList.length
    componentList.push(component)
  }
}

//删除组件
function deleteComponent(i: string) {
  const index = componentList.findIndex(function (item) {
    return item.i == i
  })
  if (componentList.length == 1) {
    chosenComponent.value = -1
  } else {
    if (chosenComponent.value === index && index > -1) {
      chosenComponent.value = 0
    }
  }
  if (index > -1) {
    componentList.splice(index, 1)
  } else {
    ElMessage.error("Invalid delete index")
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
  museschoolStore.exportManual = false
  router.push({ name: "manual-preview" })
}

//导出手册
function exportManual() {
  museschoolStore.componentList = componentList
  museschoolStore.exportManual = true
  router.push({ name: "manual-preview" })
}

//上传手册
function uploadManual() {
  //下面是上传单个组件的代码，后续要删除
  saveLocation({
    name: "test",
    x: 1,
    y: 1,
    width: 1,
    minWidth: 1,
    maxWidth: 1,
    height: 1,
    minHeight: 1,
    maxHeight: 1,
    typeId: 1,
    content: "string"
  }).then(() => {
    ElMessage.success("success")
  })
}

//修改编辑区域Tab
function changeEditorTab(i: number) {
  chosenEditorTab.value = i
}

//修改组件区域Tab
function changeComponentsTab(i: number) {
  chosenComponentsTab.value = i

  // 清空tab-btn圆角属性
  const c0 = componentsTab0.value as unknown as HTMLElement
  c0.classList.remove("rounded-bottom-right")
  const c1 = componentsTab1.value as unknown as HTMLElement
  c1.classList.remove("rounded-top-right")
  c1.classList.remove("rounded-bottom-right")
  const c2 = componentsTab2.value as unknown as HTMLElement
  c2.classList.remove("rounded-top-right")
  c2.classList.remove("rounded-bottom-right")
  const c3 = componentsTab3.value as unknown as HTMLElement
  c3.classList.remove("rounded-top-right")
  c3.classList.remove("rounded-bottom-right")
  const c4 = componentsTab4.value as unknown as HTMLElement
  c4.classList.remove("rounded-top-right")
  c4.classList.remove("rounded-bottom-right")
  const cbr = componentsTabBr.value as unknown as HTMLElement
  cbr.classList.remove("rounded-top-right")

  //根据当前选中的tab修改圆角属性
  switch (i) {
    case 0:
      c1.classList.add("rounded-top-right")
      break
    case 1:
      c0.classList.add("rounded-bottom-right")
      c2.classList.add("rounded-top-right")
      break
    case 2:
      c1.classList.add("rounded-bottom-right")
      c3.classList.add("rounded-top-right")
      break
    case 3:
      c2.classList.add("rounded-bottom-right")
      c4.classList.add("rounded-top-right")
      break
    case 4:
      c3.classList.add("rounded-bottom-right")
      cbr.classList.add("rounded-top-right")
      break
  }
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <div class="logo">
        <el-image :src="museschoolLogo" style="height: 80%">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <span>Museschool</span>
      </div>
      <!--      <div>undo-redo</div>-->
      <div class="title" @click="changeTitle">{{ title }}</div>
      <div v-if="showTitleEditor" class="titleForm">
        <el-input v-model="title" :placeholder="title" style="width: 70%" />
        <el-button color="#2565F1" @click="changeTitle">修改</el-button>
      </div>
      <div class="show-export">
        <el-button color="#2565F1" icon="Monitor" @click="toManualPreview">预览</el-button>
        <el-button color="#FFFFFF" icon="Download" @click="exportManual">导出</el-button>
        <el-button color="#2565F1" icon="Upload" @click="uploadManual">上传</el-button>
      </div>
    </div>
    <div class="main">
      <div class="prototype-components">
        <div class="components-tab-bar">
          <div
            ref="componentsTab0"
            :style="chosenComponentsTab === 0 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="changeComponentsTab(0)"
          >
            <svg-icon class="components-tab-icon" name="component" />
            组件
          </div>
          <div
            ref="componentsTab1"
            :style="chosenComponentsTab === 1 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="changeComponentsTab(1)"
          >
            <svg-icon class="components-tab-icon" name="template" />
            模板
          </div>
          <div
            ref="componentsTab2"
            :style="chosenComponentsTab === 2 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="changeComponentsTab(2)"
          >
            <svg-icon class="components-tab-icon" name="upload" />
            已上传
          </div>
          <div
            ref="componentsTab3"
            :style="chosenComponentsTab === 3 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="changeComponentsTab(3)"
          >
            <svg-icon class="components-tab-icon" name="text" />
            文本
          </div>
          <div
            ref="componentsTab4"
            :style="chosenComponentsTab === 4 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="changeComponentsTab(4)"
          >
            <svg-icon class="components-tab-icon" name="material" />
            素材
          </div>
          <div ref="componentsTabBr" style="width: 100%; height: 50%; background: #313338" />
        </div>
        <div v-if="chosenComponentsTab === 0" class="components-tab">
          <div
            v-for="(item, index) in prototypeComponentList"
            :key="item.i"
            class="droppable-element"
            draggable="true"
            @dragend="addComponent(index)"
          >
            <general-component
              :component-props="item.componentProps"
              :i="item.i"
              :showDelete="false"
              :type="item.type"
              style="background: red"
            />
          </div>
        </div>
        <div v-if="chosenComponentsTab === 1" class="components-tab">模版</div>
        <div v-if="chosenComponentsTab === 2" class="components-tab">已上传</div>

        <div v-if="chosenComponentsTab === 3" class="components-tab">文本</div>
        <div v-if="chosenComponentsTab === 4" class="components-tab">素材</div>
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
            @move="componentMoveHandler"
            @resize="componentResizeHandler"
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
        <div v-if="componentList.length !== 0" class="editor-form" style="margin-bottom: 5%">
          <div
            :style="chosenEditorTab === 0 ? activeEditorTabColor : editorTabColor"
            class="editor-tab-btn"
            @click="changeEditorTab(0)"
          >
            <el-icon size="25">
              <Edit />
            </el-icon>
            <span>填充与线条</span>
          </div>
          <div
            :style="chosenEditorTab === 1 ? activeEditorTabColor : editorTabColor"
            class="editor-tab-btn"
            @click="changeEditorTab(1)"
          >
            <el-icon size="25">
              <MagicStick />
            </el-icon>
            <span>效果</span>
          </div>
          <div
            :style="chosenEditorTab === 2 ? activeEditorTabColor : editorTabColor"
            class="editor-tab-btn"
            @click="changeEditorTab(2)"
          >
            <el-icon size="25">
              <Operation />
            </el-icon>
            <span>大小与属性</span>
          </div>
        </div>
        <div v-if="chosenEditorTab === 0" class="editor-tab">
          <div v-if="showFontColorEditor || showBackgroundColorEditor" class="editor-form">
            <div v-if="showFontColorEditor">
              <span>文本颜色 </span>
              <el-color-picker v-model="fontColor" show-alpha />
            </div>
            <div v-if="showBackgroundColorEditor">
              <span>背景颜色 </span>
              <el-color-picker v-model="backgroundColor" show-alpha />
            </div>
          </div>
        </div>
        <div v-if="chosenEditorTab === 1" class="editor-tab">效果</div>
        <div v-if="chosenEditorTab === 2" class="editor-tab">
          <div v-if="componentList.length !== 0" class="editor-form">
            <div class="half-editor-form">
              <div class="form-label">x</div>
              <el-input-number
                v-model="x"
                :max="colNum - w"
                :min="0"
                :placeholder="x.toString()"
                :step-strictly="true"
                class="input-number"
                controls-position="right"
              />
            </div>
            <div class="half-editor-form">
              <div class="form-label">y</div>
              <el-input-number
                v-model="y"
                :min="0"
                :placeholder="y.toString()"
                :step-strictly="true"
                class="input-number"
                controls-position="right"
              />
            </div>
          </div>
          <div v-if="componentList.length !== 0" class="editor-form">
            <div class="half-editor-form">
              <div class="form-label">宽</div>
              <el-input-number
                v-model="w"
                :max="maxW > colNum - x ? colNum - x : maxW"
                :min="minW"
                :placeholder="w.toString()"
                :step-strictly="true"
                class="input-number"
                controls-position="right"
              />
            </div>
            <div class="half-editor-form">
              <div class="form-label">高</div>
              <el-input-number
                v-model="h"
                :max="maxH"
                :min="minH"
                :placeholder="h.toString()"
                :step-strictly="true"
                class="input-number"
                controls-position="right"
              />
            </div>
          </div>
          <div v-if="componentList.length !== 0" class="editor-form" style="font-size: 14px">
            <div class="half-editor-form">
              <div class="form-label">最小<br />宽度</div>
              <el-input-number
                v-model="minW"
                :max="w"
                :min="1"
                :placeholder="minW.toString()"
                :step-strictly="true"
                class="input-number"
                controls-position="right"
              />
            </div>
            <div class="half-editor-form">
              <div class="form-label">最大<br />宽度</div>
              <el-input-number
                v-model="maxW"
                :max="colNum"
                :min="w"
                :placeholder="maxW.toString()"
                :step-strictly="true"
                class="input-number"
                controls-position="right"
              />
            </div>
          </div>
          <div v-if="componentList.length !== 0" class="editor-form" style="font-size: 14px">
            <div class="half-editor-form">
              <div class="form-label">最小<br />高度</div>
              <el-input-number
                v-model="minH"
                :max="h"
                :min="1"
                :placeholder="minH.toString()"
                :step-strictly="true"
                class="input-number"
                controls-position="right"
              />
            </div>
            <div class="half-editor-form">
              <div class="form-label">最大<br />高度</div>
              <el-input-number
                v-model="maxH"
                :min="h"
                :placeholder="maxH.toString()"
                :step-strictly="true"
                class="input-number"
                controls-position="right"
              />
            </div>
          </div>
          <div v-if="showTextContentEditor" class="editor-form">
            <span>文本内容</span>
          </div>
          <div v-if="showTextContentEditor" class="editor-form">
            <el-input v-model="textContent" :placeholder="textContent" autosize type="textarea" />
          </div>
          <div v-if="showImgURLEditor" class="editor-form">
            <div style="width: 11.5%; margin-right: 2.4%">URL</div>
            <el-input v-model="imgURL" :placeholder="textContent" />
          </div>
          <div v-if="showFontSizeEditor || showFontWeightEditor" class="editor-form">
            <el-input-number
              v-if="showFontSizeEditor"
              v-model="fontSize"
              :max="300"
              :min="12"
              :placeholder="fontSize.toString()"
              :step-strictly="true"
              controls-position="right"
              style="margin-right: 5%"
            />
            <el-select v-if="showFontWeightEditor" v-model="fontWeight" :placeholder="fontWeight">
              <el-option v-for="item in fontWeightOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
      display: flex;
      flex-direction: row;
      align-items: center;

      .components-tab-bar {
        width: 18%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .components-tab-btn {
          width: 100%;
          height: 10%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .components-tab-icon {
            margin-bottom: 6px;
            font-size: 30px;
          }
        }

        .rounded-top-right {
          border-radius: 0 10px 0 0;
        }

        .rounded-bottom-right {
          border-radius: 0 0 10px 0;
        }
      }

      .components-tab {
        width: 82%;
        height: 100%;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;

        .droppable-element {
          width: 60%;
          margin-top: 5%;
        }
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
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #b9b9b9;
      font-size: 15px;

      .editor-tab {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .editor-form {
          width: 80%;
          margin-top: 5%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          .editor-tab-btn {
            height: 120%;
            width: calc(100% / 3);
            margin-bottom: 5%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .half-editor-form {
            width: 46%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .form-label {
              width: 25%;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            }

            .input-number {
              width: 70%;
            }
          }
        }
      }

      .editor-form {
        width: 80%;
        margin-top: 5%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .editor-tab-btn {
          height: 120%;
          width: calc(100% / 3);
          margin-bottom: 5%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
