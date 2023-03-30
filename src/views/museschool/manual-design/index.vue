<script lang="ts" setup>
import GeneralComponent from "../components/generalComponent.vue"
import { onMounted, onUnmounted, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { Component, MuseschoolImage } from "museschool"
import { getResearchListById } from "@/api/museschool"
import { useMuseschoolStore } from "@/store/modules/museschool"
import { getManual, getUploadedImages, setManual, setUploadedImages } from "@/utils/cache/localStorage"
import { ElMessage } from "element-plus"
import { Edit, MagicStick, Operation, Picture, Plus } from "@element-plus/icons-vue"
import SvgIcon from "@/components/SvgIcon/index.vue"
import museschool_logo from "@/assets/museschool/museschool_logo.png"

const router = useRouter()

const museschoolStore = useMuseschoolStore()

/* 研学手册信息相关 ********************************************************************************************/
const id = ref(museschoolStore.manual.id) //本研学手册的id
const title = ref("研学手册标题") //标题
const titleEditorVisible = ref(false)

//修改标题
function titleChangeHandler() {
  titleEditorVisible.value = !titleEditorVisible.value
  if (!titleEditorVisible.value) {
    museschoolStore.manual.title = title.value
  }
}

//预览手册
function manualPreviewHandler() {
  museschoolStore.manual.id = id.value
  museschoolStore.manual.componentList = componentList
  museschoolStore.exportManual = false
  router.push({ name: "manual-preview" })
}

//导出手册
function manualExportHandler() {
  museschoolStore.manual.id = id.value
  museschoolStore.manual.componentList = componentList
  museschoolStore.exportManual = true
  router.push({ name: "manual-preview" })
}

//上传手册
function manualUploadHandler() {
  //此处应该加上判断是否为第一次报错（insert/update）
  // saveResearchList(title.value, componentList)
  //   .then((res: any) => {
  //     console.log(res)
  //   })
  //   .catch((err: any) => {
  //     console.error(err)
  //   })
  // const id = 1
  // updateResearchListById(id, title.value, componentList)
  //   .then((res: any) => {
  //     console.log(res)
  //   })
  //   .catch((err: any) => {
  //     console.error(err)
  //   })
  getResearchListById({ id: 1 })
    .then((res: any) => {
      console.log(res)
    })
    .catch((err: any) => {
      console.error(err)
    })
}

//清空手册
function manualClearHandler() {
  componentList.splice(0)
  setManual({
    id: id.value,
    title: title.value,
    componentList: []
  })
}

/* 组件渲染相关 ********************************************************************************************/
//添加组件应修改
//1.generalComponent
//2.prototypeComponentList原型组件列表
//3.该组件的右侧编辑区域（html&表单绑定）
//4.选择组件变化监听中的switch(每个选项)
//5.监听表单变化
//6.添加组件函数中的switch

const designZoneRef = ref(null) //设计区域组件引用
const componentList = museschoolStore.manual.componentList //组件列表

//gridlayout列数，行高
const colNum = ref(50)
const rowHeight = ref(10)

/* 组件选择相关 ********************************************************************************************/
const chosenComponent = ref(-1) //当前选择的组件index

watch(chosenComponent, (newChosenComponent) => {
  chosenEditorTab.value = 0
  textContentEditorVisible.value = false
  fontSizeEditorVisible.value = false
  fontWeightEditorVisible.value = false
  fontColorEditorVisible.value = false
  UrlEditorVisible.value = false
  backgroundColorEditorVisible.value = false
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
        textContentEditorVisible.value = true
        textContent.value = componentList[newChosenComponent].componentProps?.content || ""
        fontSizeEditorVisible.value = true
        fontSize.value = parseInt(componentList[newChosenComponent].componentProps?.fontSize || "16")
        fontWeightEditorVisible.value = true
        fontWeight.value = componentList[newChosenComponent].componentProps?.fontWeight || "normal"
        fontColorEditorVisible.value = true
        fontColor.value = componentList[newChosenComponent].componentProps?.color || "#000000"
        backgroundColorEditorVisible.value = true
        backgroundColor.value = componentList[newChosenComponent].componentProps?.background || "#ffffff"
        break
      case 1:
        UrlEditorVisible.value = true
        UrlProps.value = componentList[newChosenComponent].componentProps?.url || ""
        backgroundColorEditorVisible.value = true
        backgroundColor.value = componentList[newChosenComponent].componentProps?.background || "#ffffff"
        break
      case 2:
        UrlEditorVisible.value = true
        UrlProps.value = componentList[newChosenComponent].componentProps?.url || ""
        backgroundColorEditorVisible.value = true
        backgroundColor.value = componentList[newChosenComponent].componentProps?.background || "#ffffff"
        break
    }
  }
})

//选择组件
function chooseComponentHandler(i: string) {
  chosenComponent.value = componentList.findIndex(function (item) {
    return item.i == i
  })
}

/* 原型组件区（左侧区域）Tab相关 ********************************************************************************************/
const chosenComponentsTab = ref(0)
const componentsTabColor = "color: #6f6f6f;background:#313338"
const activeComponentsTabColor = "color: #ffffff"

//tab-btn组件引用
const componentsTabBtn0Ref = ref(null)
const componentsTabBtn1Ref = ref(null)
const componentsTabBtn2Ref = ref(null)
const componentsTabBtn3Ref = ref(null)
const componentsTabBtn4Ref = ref(null)
const componentsTabBrBtnRef = ref(null)

/* 组件增删相关 ********************************************************************************************/
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
  },
  {
    i: "-3",
    type: 2,
    componentProps: {
      url: "/Users/north/Documents/Code/Web/muse-fronted/src/assets/museschool/canon.mp3",
      background: "#ffffff"
    }
  }
])
const mouseXY = { x: 0, y: 0 } //监测鼠标位置
const nextId = ref(1) //下一个新增组件的id

//拖拽添加组件
function addComponentHandler(index: number) {
  const parentRect = (designZoneRef.value as unknown as HTMLElement).getBoundingClientRect()
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
      case 2:
        componentProps = {
          url: "@/assets/museschool/canon.mp3",
          background: "#ffffff"
        }
        break
    }
    const component: Component = {
      i: nextId.value.toString(),
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
    nextId.value++
    chosenComponent.value = componentList.length
    componentList.push(component)
  }
}

//删除组件
function deleteComponentHandler(i: string) {
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

/* 文件上传相关 ********************************************************************************************/
//文件类型Tab相关
const chosenFileTab = ref(0)
const fileTabColor = "border-bottom: 2px solid #4A505E"
const activeFileTabColor = "border-bottom: 2px solid #6896FC"

const uploadedImages: MuseschoolImage[] = reactive([]) //已上传的图片
const uploadDialogVisible = ref(false)
const fileUrl = ref("")
const fileList = ref<any[]>([])
const previewPicDialogVisible = ref(false)
const previewImage = ref("")

//文件修改处理
function fileChangeHandler(_file: any, _fileList: any) {
  if (_file) {
    const extension = _file.name.substring(_file.name.lastIndexOf(".") + 1)
    const size = _file.size / 1024 / 1024
    if (extension !== "jpg" && extension !== "png" && extension !== "jpeg") {
      ElMessage.warning("请上传后缀名为.jpg或.jpeg或.png的图片")
    }
    if (size > 20) {
      ElMessage.warning("文件大小请不要超过20MB")
    }
    fileList.value.push(_file.raw)
  }
}

//文件超出限制处理
function fileExceedHandler(_files: any, _fileList: any) {
  ElMessage.warning("很抱歉,只能上传5张图片")
}

//文件预览处理
function filePreviewHandler(_file: any) {
  previewImage.value = _file.url
  previewPicDialogVisible.value = true
}

//文件移除处理
function fileRemoveHandler(_file: any, _fileList: any) {
  _fileList.forEach(function (item: any) {
    if (item === _file) {
      _fileList.splice(_fileList.indexOf(item), 1)
    }
  })
  fileList.value = _fileList
  // uploadedImages = _fileList
}

//上传文件前的钩子
function beforeUploadFileHandler(_file: any) {
  fileUrl.value = URL.createObjectURL(_file)
  return false
}

//上传文件
function fileUploadHandler() {}

/* 组件参数修改区（右侧区域）Tab相关 ********************************************************************************************/
const chosenEditorTab = ref(0)
const editorTabColor = "color: #6f6f6f;border-bottom: 2px solid #e4e4e4"
const activeEditorTabColor = "color: #326EF2;border-bottom: 2px solid #326EF2"

//修改组件区域Tab
function componentsTabChangeHandler(i: number) {
  chosenComponentsTab.value = i
  // 清空tab-btn圆角属性
  const c0 = componentsTabBtn0Ref.value as unknown as HTMLElement
  c0.classList.remove("rounded-bottom-right")
  const c1 = componentsTabBtn1Ref.value as unknown as HTMLElement
  c1.classList.remove("rounded-top-right")
  c1.classList.remove("rounded-bottom-right")
  const c2 = componentsTabBtn2Ref.value as unknown as HTMLElement
  c2.classList.remove("rounded-top-right")
  c2.classList.remove("rounded-bottom-right")
  const c3 = componentsTabBtn3Ref.value as unknown as HTMLElement
  c3.classList.remove("rounded-top-right")
  c3.classList.remove("rounded-bottom-right")
  const c4 = componentsTabBtn4Ref.value as unknown as HTMLElement
  c4.classList.remove("rounded-top-right")
  c4.classList.remove("rounded-bottom-right")
  const cbr = componentsTabBrBtnRef.value as unknown as HTMLElement
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

/* 组件参数修改相关 ********************************************************************************************/
//填充与线条
//文本颜色
const fontColor = ref("#000000")
const fontColorEditorVisible = ref(false)
//背景颜色
const backgroundColor = ref("#FFFFFF")
const backgroundColorEditorVisible = ref(false)
//监听变化
watch(fontColor, (newFontColor) => {
  componentList[chosenComponent.value].componentProps!.color = newFontColor
})
watch(backgroundColor, (newBackgroundColor) => {
  componentList[chosenComponent.value].componentProps!.background = newBackgroundColor
})
//效果

//大小与属性
//位置大小
const x = ref(1)
const y = ref(1)
const w = ref(10)
const h = ref(10)
const minW = ref(1)
const maxW = ref(20)
const minH = ref(1)
const maxH = ref(20)
//监听变化
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

//更改组件位置时同步修改表单值
function componentMoveHandler(i: string, newX: number, newY: number) {
  chooseComponentHandler(i)
  x.value = newX
  y.value = newY
}

//更改组件大小时同步修改表单值
function componentResizeHandler(i: string, newW: number, newH: number) {
  w.value = newW
  h.value = newH
}

//文本内容
const textContent = ref("")
const textContentEditorVisible = ref(false)
//字号
const fontSize = ref(16)
const fontSizeEditorVisible = ref(false)
//字重
const fontWeight = ref("")
const fontWeightOptions = reactive([
  { value: "bold", label: "Bold" },
  { value: "bolder", label: "Bolder" },
  { value: "lighter", label: "Lighter" },
  {
    value: "normal",
    label: "normal"
  }
])
const fontWeightEditorVisible = ref(false)
//Url内容
const UrlProps = ref("")
const UrlEditorVisible = ref(false)
//监听变化
watch(textContent, (newTextContent) => {
  componentList[chosenComponent.value].componentProps!.content = newTextContent
})
watch(fontSize, (newFontSize) => {
  componentList[chosenComponent.value].componentProps!.fontSize = newFontSize.toString()
})
watch(fontWeight, (newFontWeight) => {
  componentList[chosenComponent.value].componentProps!.fontWeight = newFontWeight
})
watch(UrlProps, (newUrl) => {
  componentList[chosenComponent.value].componentProps!.url = newUrl
})

/* 生命周期钩子 ********************************************************************************************/
onMounted(() => {
  //若componentList为空，尝试从本地存储获取数据
  if (componentList.length == 0) {
    const storedComponentList = getManual().componentList
    if (storedComponentList.length > 0) {
      nextId.value = parseInt(storedComponentList[storedComponentList.length - 1].i) + 1
      if (storedComponentList) {
        for (let i = 0; i < storedComponentList.length; i++) {
          componentList.push(storedComponentList[i])
        }
      }
    }
  } else {
    nextId.value = parseInt(componentList[componentList.length - 1].i) + 1
  }
  //若id为负，尝试从本地存储获取数据
  if (id.value < 0) {
    if (getManual().id > 0) {
      id.value = getManual().id
    }
  }
  //若uploadedImages为空，尝试从本地存储获取数据
  if (uploadedImages.length == 0) {
    const storedImages: MuseschoolImage[] = getUploadedImages()
    if (storedImages.length > 0) {
      for (let i = 0; i < storedImages.length; i++) {
        uploadedImages.push(storedImages[i])
      }
    }
  }
  resizeHandler() //计算行高
  componentsTabChangeHandler(0) //默认为组件tab
  window.addEventListener("resize", resizeHandler) //添加页面窗口大小监听器
  document.addEventListener("dragover", dragoverHandler) //添加鼠标位置监听器
  window.addEventListener("beforeunload", beforeunloadHandler) //添加unload监听器，持久化存储manual
})

onUnmounted(() => {
  setManual({ id: id.value, title: title.value, componentList: componentList }) //持久化存储manual
  setUploadedImages(uploadedImages) //持久化存储uploadedImages
  window.removeEventListener("resize", resizeHandler) //移除页面窗口大小监听器
  document.removeEventListener("dragover", dragoverHandler) //移除鼠标位置监听器
  window.removeEventListener("beforeunload", beforeunloadHandler) //移除unload监听器
})

//监听页面窗口大小变化，重新计算行高
function resizeHandler() {
  rowHeight.value = (designZoneRef.value as unknown as HTMLElement).getBoundingClientRect().width / colNum.value
}

//鼠标拖动组件时获取鼠标位置
function dragoverHandler(e: { clientX: number; clientY: number }) {
  mouseXY.x = e.clientX
  mouseXY.y = e.clientY
}

//unload之前持久化存储
function beforeunloadHandler() {
  setManual({ id: id.value, title: title.value, componentList: componentList }) //持久化存储manual
  setUploadedImages(uploadedImages) //持久化存储uploadedImages
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <div class="logo">
        <el-image :src="museschool_logo" style="height: 80%">
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
      <div class="title" @click="titleChangeHandler">{{ title }}</div>
      <div v-if="titleEditorVisible" class="titleForm">
        <el-input v-model="title" :placeholder="title" style="width: 70%" />
        <el-button color="#2565F1" @click="titleChangeHandler">修改</el-button>
      </div>
      <div class="header-btn">
        <el-button color="#2565F1" icon="Monitor" @click="manualPreviewHandler">预览</el-button>
        <el-button color="#FFFFFF" icon="Download" @click="manualExportHandler">导出</el-button>
        <el-button color="#2565F1" icon="Upload" @click="manualUploadHandler">上传</el-button>
        <el-button icon="Delete" theme="danger" @click="manualClearHandler">清空</el-button>
      </div>
    </div>
    <div class="main">
      <div class="prototype-components">
        <div class="components-tab-bar">
          <div
            ref="componentsTabBtn0Ref"
            :style="chosenComponentsTab === 0 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="componentsTabChangeHandler(0)"
          >
            <svg-icon class="components-tab-icon" name="component" />
            组件
          </div>
          <div
            ref="componentsTabBtn1Ref"
            :style="chosenComponentsTab === 1 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="componentsTabChangeHandler(1)"
          >
            <svg-icon class="components-tab-icon" name="template" />
            模板
          </div>
          <div
            ref="componentsTabBtn2Ref"
            :style="chosenComponentsTab === 2 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="componentsTabChangeHandler(2)"
          >
            <svg-icon class="components-tab-icon" name="upload" />
            已上传
          </div>
          <div
            ref="componentsTabBtn3Ref"
            :style="chosenComponentsTab === 3 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="componentsTabChangeHandler(3)"
          >
            <svg-icon class="components-tab-icon" name="text" />
            文本
          </div>
          <div
            ref="componentsTabBtn4Ref"
            :style="chosenComponentsTab === 4 ? activeComponentsTabColor : componentsTabColor"
            class="components-tab-btn"
            @click="componentsTabChangeHandler(4)"
          >
            <svg-icon class="components-tab-icon" name="material" />
            素材
          </div>
          <div ref="componentsTabBrBtnRef" style="width: 100%; height: 50%; background: #313338" />
        </div>
        <div v-if="chosenComponentsTab === 0" class="components-tab">
          <div
            v-for="(item, index) in prototypeComponentList"
            :key="item.i"
            class="droppable-element"
            draggable="true"
            @dragend="addComponentHandler(index)"
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
        <div v-if="chosenComponentsTab === 2" class="components-tab">
          <el-form style="width: 100%">
            <el-form-item>
              <el-input placeholder="搜索已上传的图片/视频/音频" prefix-icon="Search" />
            </el-form-item>
          </el-form>
          <el-button
            color="#386DE4"
            style="width: 100%; margin-top: 5%; margin-bottom: 5%"
            @click="uploadDialogVisible = true"
          >
            上传文件
          </el-button>
          <el-dialog v-model="uploadDialogVisible" title="上传文件">
            <!--            现在上传的文件默认是图片，后续要进行判断并区分处理，注意下方el-upload的修改-->
            <el-form>
              <el-form-item>
                <el-upload
                  :auto-upload="false"
                  :before-upload="beforeUploadFileHandler"
                  :file-list="fileList"
                  :limit="5"
                  :multiple="true"
                  :on-change="fileChangeHandler"
                  :on-exceed="fileExceedHandler"
                  :on-preview="filePreviewHandler"
                  :on-remove="fileRemoveHandler"
                  accept=".jpg,.png,.jpeg,.JPG,.JPEG"
                  action="#"
                  class="uploader"
                  list-type="picture-card"
                >
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-upload>
              </el-form-item>
            </el-form>
            <el-dialog
              v-model="previewPicDialogVisible"
              style="display: block"
              width="50%"
              @close="previewPicDialogVisible = false"
            >
              <el-image :src="previewImage" style="margin: auto" />
            </el-dialog>
            <template #footer>
              <el-button type="primary" @click="fileUploadHandler">确认</el-button>
              <el-button @click="uploadDialogVisible = false">取消</el-button>
            </template>
          </el-dialog>
          <div class="file-tab-bar">
            <div
              :style="chosenFileTab === 0 ? activeFileTabColor : fileTabColor"
              class="file-tab-btn"
              @click="chosenFileTab = 0"
            >
              图片
            </div>
            <div
              :style="chosenFileTab === 1 ? activeFileTabColor : fileTabColor"
              class="file-tab-btn"
              @click="chosenFileTab = 1"
            >
              视频
            </div>
            <div
              :style="chosenFileTab === 2 ? activeFileTabColor : fileTabColor"
              class="file-tab-btn"
              @click="chosenFileTab = 2"
            >
              音频
            </div>
          </div>
          <div v-if="chosenFileTab === 0" class="file-tab">图片</div>
          <div v-if="chosenFileTab === 1" class="file-tab">视频</div>
          <div v-if="chosenFileTab === 2" class="file-tab">音频</div>
        </div>
        <div v-if="chosenComponentsTab === 3" class="components-tab">文本</div>
        <div v-if="chosenComponentsTab === 4" class="components-tab">素材</div>
      </div>
      <div ref="designZoneRef" class="design-zone">
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
              @delete-component="deleteComponentHandler"
              @choose-component="chooseComponentHandler"
            />
          </grid-item>
        </grid-layout>
      </div>
      <div class="props-editor">
        <div v-if="componentList.length !== 0" class="editor-form" style="margin-bottom: 5%">
          <div
            :style="chosenEditorTab === 0 ? activeEditorTabColor : editorTabColor"
            class="editor-tab-btn"
            @click="chosenEditorTab = 0"
          >
            <el-icon size="25">
              <Edit />
            </el-icon>
            <span>填充与线条</span>
          </div>
          <div
            :style="chosenEditorTab === 1 ? activeEditorTabColor : editorTabColor"
            class="editor-tab-btn"
            @click="chosenEditorTab = 1"
          >
            <el-icon size="25">
              <MagicStick />
            </el-icon>
            <span>效果</span>
          </div>
          <div
            :style="chosenEditorTab === 2 ? activeEditorTabColor : editorTabColor"
            class="editor-tab-btn"
            @click="chosenEditorTab = 2"
          >
            <el-icon size="25">
              <Operation />
            </el-icon>
            <span>大小与属性</span>
          </div>
        </div>
        <div v-if="chosenEditorTab === 0" class="editor-tab">
          <div v-if="fontColorEditorVisible || backgroundColorEditorVisible" class="editor-form">
            <div v-if="fontColorEditorVisible">
              <span>文本颜色 </span>
              <el-color-picker v-model="fontColor" show-alpha />
            </div>
            <div v-if="backgroundColorEditorVisible">
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
          <div v-if="textContentEditorVisible" class="editor-form">
            <span>文本内容</span>
          </div>
          <div v-if="textContentEditorVisible" class="editor-form">
            <el-input v-model="textContent" :placeholder="textContent" autosize type="textarea" />
          </div>
          <div v-if="UrlEditorVisible" class="editor-form">
            <div style="width: 11.5%; margin-right: 2.4%">URL</div>
            <el-input v-model="UrlProps" :placeholder="textContent" />
          </div>
          <div v-if="fontSizeEditorVisible || fontWeightEditorVisible" class="editor-form">
            <el-input-number
              v-if="fontSizeEditorVisible"
              v-model="fontSize"
              :max="300"
              :min="12"
              :placeholder="fontSize.toString()"
              :step-strictly="true"
              controls-position="right"
              style="margin-right: 5%"
            />
            <el-select v-if="fontWeightEditorVisible" v-model="fontWeight" :placeholder="fontWeight">
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

    .header-btn {
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
        padding: 5%;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;

        .droppable-element {
          width: 60%;
          margin-top: 5%;
        }

        .file-tab-bar {
          width: 100%;
          height: 5%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          .file-tab-btn {
            width: 30%;
            height: 100%;
            font-size: 20px;
            color: white;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
        }

        .file-tab {
          width: 100%;
          height: 80%;
          margin-top: 5%;
          overflow-y: scroll;
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
