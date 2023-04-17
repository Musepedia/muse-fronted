<script lang="ts" setup>
import GeneralComponent from "../components/GeneralComponent.vue"
import { onMounted, onUnmounted, reactive, Ref, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { MuseComponent, MuseImage, MuseManual } from "museschool"
import { useMuseschoolStore } from "@/store/modules/museschool"
import { getManual, getUploadedImages, setManual, setUploadedImages } from "@/utils/cache/localStorage"
import { ElMessage } from "element-plus"
import { Close, Edit, MagicStick, Operation, Picture, Plus } from "@element-plus/icons-vue"
import SvgIcon from "@/components/SvgIcon/index.vue"
import museschool_logo from "@/assets/museschool/museschool_logo.png"
import { uploadFile } from "@/api/adminMuseum"

const router = useRouter()

const museschoolStore = useMuseschoolStore()

/* 研学手册信息相关 ********************************************************************************************/
//添加组件应修改
//1.GeneralComponent
//2.prototypeComponentList原型组件列表
//3.该组件的右侧编辑区域（html&表单绑定）
//4.选择组件变化监听中的switch(每个选项)
//5.监听表单变化
//6.添加组件函数中的switch
const thisManual: MuseManual = museschoolStore.manual //本页面的研学手册
const titleEditorVisible: Ref<boolean> = ref(false) //标题表单是否可见

const designZoneRef = ref<HTMLInputElement | null>(null) //设计区域组件引用

//gridlayout列数，行高
const colNum: Ref<number> = ref(50)
const rowHeight: Ref<number> = ref(10)

const pageHeight: Ref<string> = ref(";height:800px") //页面高度
const pageEditBtnVisible: Ref<boolean> = ref(false) //页面编辑按钮是否可见
const pageEditDialogVisible: Ref<boolean> = ref(false) //页面编辑对话框是否可见

//监听manual变化，同步修改到museschoolStore
watch(thisManual, (newThisManual) => {
  museschoolStore.manual = newThisManual
})

//跳转到手册预览页
function navigateToManualPreview(exportManual: boolean) {
  museschoolStore.exportManual = exportManual
  router.push({ name: "manual-preview" })
}

//上传手册
function manualUploadHandler() {
  //此处应该加上判断是否为第一次保存（insert/update）
}

//清空手册
function manualClearHandler() {
  thisManual.nextComponentId = 1
  thisManual.pages.splice(0)
  thisManual.pages.push({
    page: 0,
    pageInfo: {
      background: "background:white"
    },
    componentList: []
  })
  setManual(thisManual)
}

//添加页
function addPageHandler(pageIndex: number) {
  thisManual.pages.splice(pageIndex + 1, 0, {
    page: pageIndex + 1,
    pageInfo: {
      background: "background:white"
    },
    componentList: []
  })
  ElMessage.info("添加成功")
}

//编辑页
function editPageHandler(pageIndex: number) {
  pageEditDialogVisible.value = true
}

//修改页
function deletePageHandler(pageIndex: number) {
  if (thisManual.pages.length == 1 && pageIndex <= 0) {
    ElMessage.error("至少保留一页")
  } else {
    thisManual.pages.splice(pageIndex, 1)
  }
}

/* 组件选择相关 ********************************************************************************************/
//当前选择组件的页码和index
const chosenComponent = reactive({
  pageIndex: -1,
  componentIndex: -1
})

//监听选择组件的变化
watch(chosenComponent, (newChosenComponent) => {
  //选择组件后重置右侧参数编辑区域显示内容
  chosenEditorTab.value = 0
  textContentEditorVisible.value = false
  fontSizeEditorVisible.value = false
  fontWeightEditorVisible.value = false
  fontColorEditorVisible.value = false
  UrlEditorVisible.value = false
  backgroundColorEditorVisible.value = false
  if (newChosenComponent.pageIndex != -1 && newChosenComponent.componentIndex != -1) {
    //更改右侧编辑区域显示内容,修改表单placeholder
    x.value = thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].x
    y.value = thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].y
    w.value = thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].w
    h.value = thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].h
    minW.value = thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].minW
    maxW.value = thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].maxW
    minH.value = thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].minH
    maxH.value = thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].maxH
    switch (thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].type) {
      case 0:
        textContentEditorVisible.value = true
        textContent.value =
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.content || ""
        fontSizeEditorVisible.value = true
        fontSize.value = parseInt(
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.fontSize || "16"
        )
        fontWeightEditorVisible.value = true
        fontWeight.value =
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.fontWeight || "normal"
        fontColorEditorVisible.value = true
        fontColor.value =
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.color || "#000000"
        backgroundColorEditorVisible.value = true
        backgroundColor.value =
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.background || "#ffffff"
        break
      case 1:
        UrlEditorVisible.value = true
        UrlProps.value =
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.url || ""
        backgroundColorEditorVisible.value = true
        backgroundColor.value =
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.background || "#ffffff"
        break
      case 2:
        UrlEditorVisible.value = true
        UrlProps.value =
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.url || ""
        backgroundColorEditorVisible.value = true
        backgroundColor.value =
          thisManual.pages[newChosenComponent.pageIndex].componentList[newChosenComponent.componentIndex].componentProps
            ?.background || "#ffffff"
        break
    }
  }
})

//选择组件
function chooseComponentHandler(pageIndex: number, componentIndex: number) {
  chosenComponent.pageIndex = pageIndex
  chosenComponent.componentIndex = componentIndex
}

//根据组件id选择组件
function chooseComponentById(id: string) {
  thisManual.pages.forEach((page, pageIndex) => {
    page.componentList.forEach((component, componentIndex) => {
      if (component.i == id) {
        chooseComponentHandler(pageIndex, componentIndex)
      }
    })
  })
}

/* 原型组件区（左侧区域）Tab相关 ********************************************************************************************/
const chosenComponentsTab: Ref<number> = ref(0)
const componentsTabColor = "color: #6f6f6f;background:#313338"
const activeComponentsTabColor = "color: #ffffff"

//tab-btn组件引用
const componentsTabBtn0Ref = ref<HTMLInputElement | null>(null)
const componentsTabBtn1Ref = ref<HTMLInputElement | null>(null)
const componentsTabBtn2Ref = ref<HTMLInputElement | null>(null)
const componentsTabBtn3Ref = ref<HTMLInputElement | null>(null)
const componentsTabBtn4Ref = ref<HTMLInputElement | null>(null)
const componentsTabBrBtnRef = ref<HTMLInputElement | null>(null)

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

//找出拖拽目标页
function getTargetPage() {
  const pages = (designZoneRef.value as unknown as HTMLElement).children
  let pageIndex = undefined
  let pageRect = undefined
  for (let i = 0; i < pages.length; i++) {
    const parentRect = pages[i].getBoundingClientRect()
    if (
      mouseXY.x > parentRect.left &&
      mouseXY.x < parentRect.right &&
      mouseXY.y > parentRect.top &&
      mouseXY.y < parentRect.bottom
    ) {
      pageIndex = i
      pageRect = parentRect
      break
    }
  }
  return {
    pageIndex: pageIndex,
    pageRect: pageRect
  }
}

//添加组件
function addComponent(component: MuseComponent, pageIndex: number) {
  thisManual.nextComponentId++
  chooseComponentHandler(pageIndex, thisManual.pages[pageIndex].componentList.length - 1)
  thisManual.pages[pageIndex].componentList.push(component)
}

//拖拽添加组件
function addComponentHandler(index: number) {
  //找出拖拽目标页
  const { pageIndex, pageRect } = getTargetPage()
  if (pageIndex != undefined && pageRect != undefined) {
    //准备新组件的参数
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
    addComponent(
      {
        i: thisManual.nextComponentId.toString(),
        x: Math.trunc((mouseXY.x - pageRect.left) / (pageRect.width / colNum.value)),
        y: Math.trunc((mouseXY.y - pageRect.top) / rowHeight.value),
        w: 10,
        h: 10,
        minW: 1,
        minH: 1,
        maxW: 20,
        maxH: 20,
        type: index,
        componentProps: componentProps!
      },
      pageIndex
    )
  }
}

//拖拽添加图片
function addImageHandler(index: number) {
  //找出拖拽目标页
  const { pageIndex, pageRect } = getTargetPage()
  if (pageIndex != undefined && pageRect != undefined) {
    addComponent(
      {
        i: thisManual.nextComponentId.toString(),
        x: Math.trunc((mouseXY.x - pageRect.left) / (pageRect.width / colNum.value)),
        y: Math.trunc((mouseXY.y - pageRect.top) / rowHeight.value),
        w: 10,
        h: 10,
        minW: 1,
        minH: 1,
        maxW: 20,
        maxH: 20,
        type: 1,
        componentProps: {
          url: uploadedImages[index].url,
          background: "#ffffff"
        }
      },
      pageIndex
    )
  }
}

//删除组件
function deleteComponentHandler(pageIndex: number, componentIndex: number) {
  if (pageIndex >= 0 && componentIndex >= 0) {
    if (chosenComponent.pageIndex == pageIndex && chosenComponent.componentIndex == componentIndex) {
      chooseComponentHandler(-1, -1)
    }
    thisManual.pages[pageIndex].componentList.splice(componentIndex, 1)
  } else {
    ElMessage.error("Invalid delete index")
  }
}

/* 文件上传相关 ********************************************************************************************/
//文件类型Tab相关
const chosenFileTab: Ref<number> = ref(0)
const fileTabColor = "border-bottom: 2px solid #4A505E"
const activeFileTabColor = "border-bottom: 2px solid #6896FC"

const uploadedImages: MuseImage[] = reactive([]) //已上传的图片
const uploadDialogVisible: Ref<boolean> = ref(false)
const fileUrl: Ref<string> = ref("")
const imageList = ref<any[]>([])
const fileList = ref<any[]>([])
const previewPicDialogVisible: Ref<boolean> = ref(false)
const previewImage: Ref<string> = ref("")

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
  imageList.value = _fileList
}

//上传文件前的钩子
function beforeUploadFileHandler(_file: any) {
  fileUrl.value = URL.createObjectURL(_file)
  return false
}

//上传文件
async function fileUploadHandler() {
  await handleUpload()
  uploadDialogVisible.value = false
}

const handleUpload = () => {
  const p1 = Promise.resolve(true)
  const pList = ref<any[]>([])
  pList.value[0] = p1
  if (fileList.value.length === 0) {
    return new Promise((resolve) => {
      // uploadedImages.values = imageList
      resolve(true)
    })
  } else {
    fileList.value.forEach(function (item, index) {
      // await Promise.all(pList.value.slice(0, index + 1))
      pList.value[index + 1] = new Promise((resolve, reject) => {
        if (item.url !== undefined) {
          imageList.value.push(item.url)
          resolve(true)
        } else {
          const param = new FormData()
          param.append("file", item)
          uploadFile(param)
            .then((res) => {
              imageList.value.push(res.data.data)
              uploadedImages.push({
                url: res.data.data
              })
              resolve(index)
            })
            .catch((error) => {
              reject(error)
            })
        }
      })
    })
    return Promise.all(pList.value)
    //promise.all方法用于将多个promise实例，包装成一个新的promise实例
  }
}

/* 组件参数修改区（右侧区域）Tab相关 ********************************************************************************************/
const chosenEditorTab: Ref<number> = ref(0)
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
const fontColor: Ref<string> = ref("#000000")
const fontColorEditorVisible: Ref<boolean> = ref(false)
//背景颜色
const backgroundColor: Ref<string> = ref("#FFFFFF")
const backgroundColorEditorVisible: Ref<boolean> = ref(false)
//监听变化
watch(fontColor, (newFontColor) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].componentProps!.color =
    newFontColor
})
watch(backgroundColor, (newBackgroundColor) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].componentProps!.background =
    newBackgroundColor
})
//效果

//大小与属性
//位置大小
const x: Ref<number> = ref(1)
const y: Ref<number> = ref(1)
const w: Ref<number> = ref(10)
const h: Ref<number> = ref(10)
const minW: Ref<number> = ref(1)
const maxW: Ref<number> = ref(20)
const minH: Ref<number> = ref(1)
const maxH: Ref<number> = ref(20)
//监听变化
watch(x, (newX) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].x = newX
})
watch(y, (newY) => {
  const tempY = thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].y
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].y = newY
  if (!checkComponentPos(chosenComponent.pageIndex, chosenComponent.componentIndex)) {
    thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].y = tempY
    setTimeout(() => {
      y.value = thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].y
    }, 0)
  }
})
watch(w, (newW) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].w = newW
})
watch(h, (newH) => {
  const tempH = thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].h
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].h = newH
  if (!checkComponentPos(chosenComponent.pageIndex, chosenComponent.componentIndex)) {
    thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].h = tempH
    setTimeout(() => {
      h.value = thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].h
    }, 0)
  }
})
watch(minW, (newMinW) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].minW = newMinW
})
watch(maxW, (newMaxW) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].maxW = newMaxW
})
watch(minH, (newMinH) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].minH = newMinH
})
watch(maxH, (newMaxH) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].maxH = newMaxH
})

//检查组件位置范围是否合法
function checkComponentPos(pageIndex: number, componentIndex: number): boolean {
  const pageRect = (designZoneRef.value as unknown as HTMLElement).children[pageIndex].getBoundingClientRect()
  const component = thisManual.pages[pageIndex].componentList[componentIndex]
  return pageRect.top + (component.y + component.h) * rowHeight.value < pageRect.bottom
}

//更改组件位置时同步修改表单值
function componentMovedHandler(i: string, newX: number, newY: number) {
  const tempX = x.value
  const tempY = y.value
  x.value = newX
  y.value = newY
  chooseComponentById(i)
  if (!checkComponentPos(chosenComponent.pageIndex, chosenComponent.componentIndex)) {
    x.value = tempX
    y.value = tempY
    setTimeout(() => {
      thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].x = x.value
      thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].y = y.value
    }, 1)
  }
}

//更改组件大小时同步修改表单值
function componentResizedHandler(i: string, newW: number, newH: number) {
  const tempW = w.value
  const tempH = h.value
  w.value = newW
  h.value = newH
  chooseComponentById(i)
  if (!checkComponentPos(chosenComponent.pageIndex, chosenComponent.componentIndex)) {
    w.value = tempW
    h.value = tempH
    setTimeout(() => {
      thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].w = w.value
      thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].h = h.value
    }, 1)
  }
}

//文本内容
const textContent: Ref<string> = ref("")
const textContentEditorVisible: Ref<boolean> = ref(false)
//字号
const fontSize: Ref<number> = ref(16)
const fontSizeEditorVisible: Ref<boolean> = ref(false)
//字重
const fontWeight: Ref<string> = ref("")
const fontWeightOptions = reactive([
  { value: "bold", label: "Bold" },
  { value: "bolder", label: "Bolder" },
  { value: "lighter", label: "Lighter" },
  { value: "normal", label: "normal" }
])
const fontWeightEditorVisible: Ref<boolean> = ref(false)
//Url内容
const UrlProps: Ref<string> = ref("")
const UrlEditorVisible: Ref<boolean> = ref(false)
//监听变化
watch(textContent, (newTextContent) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].componentProps!.content =
    newTextContent
})
watch(fontSize, (newFontSize) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].componentProps!.fontSize =
    newFontSize.toString()
})
watch(fontWeight, (newFontWeight) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].componentProps!.fontWeight =
    newFontWeight
})
watch(UrlProps, (newUrl) => {
  thisManual.pages[chosenComponent.pageIndex].componentList[chosenComponent.componentIndex].componentProps!.url = newUrl
})

/* 生命周期钩子 ********************************************************************************************/
onMounted(() => {
  //若manual为空或者id为默认值，尝试从本地存储获取数据
  if ((thisManual.pages.length == 1 && thisManual.pages[0].componentList.length == 0) || thisManual.id == -1) {
    const storedManual = getManual()
    thisManual.id = storedManual.id
    thisManual.title = storedManual.title
    thisManual.pages = storedManual.pages
  }
  //若uploadedImages为空，尝试从本地存储获取数据
  if (uploadedImages.length == 0) {
    const storedImages: MuseImage[] = getUploadedImages()
    if (storedImages.length > 0) {
      storedImages.forEach((storedImage) => {
        uploadedImages.push(storedImage)
      })
    }
  }
  resizeHandler() //计算行高、页高
  componentsTabChangeHandler(0) //默认为组件tab
  window.addEventListener("resize", resizeHandler) //添加页面窗口大小监听器
  document.addEventListener("mousemove", mouseMoveHandler) //添加鼠标位置监听器
  document.addEventListener("dragover", mouseMoveHandler) //添加鼠标位置监听器
  window.addEventListener("beforeunload", beforeunloadHandler) //添加unload监听器，持久化存储manual
})

onUnmounted(() => {
  setManual(thisManual) //持久化存储manual
  setUploadedImages(uploadedImages) //持久化存储uploadedImages
  window.removeEventListener("resize", resizeHandler) //移除页面窗口大小监听器
  document.removeEventListener("mousemove", mouseMoveHandler) //移除鼠标位置监听器
  document.removeEventListener("dragover", mouseMoveHandler) //移除鼠标位置监听器
  window.removeEventListener("beforeunload", beforeunloadHandler) //移除unload监听器
})

//监听页面窗口大小变化，重新计算行高、页高
function resizeHandler() {
  const pageWidth = (designZoneRef.value as unknown as HTMLElement).getBoundingClientRect().width * 0.96
  pageHeight.value = ";height:" + (pageWidth * Math.sqrt(2)).toString() + "px"
  rowHeight.value = pageWidth / colNum.value
}

//鼠标拖动组件时获取鼠标位置
function mouseMoveHandler(e: { clientX: number; clientY: number }) {
  mouseXY.x = e.clientX
  mouseXY.y = e.clientY
}

//unload之前持久化存储
function beforeunloadHandler() {
  setManual(thisManual) //持久化存储manual
  setUploadedImages(uploadedImages) //持久化存储uploadedImages
}
</script>

<template>
  <div class="manual-design">
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
      <div class="title" @click="titleEditorVisible = true">{{ thisManual.title }}</div>
      <div v-if="titleEditorVisible" class="titleForm">
        <el-input v-model="thisManual.title" :placeholder="thisManual.title" style="width: 70%" />
        <el-button color="#2565F1" @click="titleEditorVisible = false">修改</el-button>
      </div>
      <div class="header-btn">
        <el-button color="#2565F1" icon="Monitor" @click="navigateToManualPreview(false)">预览</el-button>
        <el-button color="#FFFFFF" icon="Download" @click="navigateToManualPreview(true)">导出</el-button>
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
            <!--现在上传的文件默认是图片，后续要进行判断并区分处理，注意下方el-upload的修改-->
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
          <div v-if="chosenFileTab === 0" class="file-tab">
            <el-image
              v-for="(image, index) in uploadedImages"
              :key="index"
              :src="image.url"
              draggable="true"
              style="height: 10%; margin-right: 5%"
              @dragend="addImageHandler(index)"
            />
          </div>
          <div v-if="chosenFileTab === 1" class="file-tab">视频</div>
          <div v-if="chosenFileTab === 2" class="file-tab">音频</div>
        </div>
        <div v-if="chosenComponentsTab === 3" class="components-tab">文本</div>
        <div v-if="chosenComponentsTab === 4" class="components-tab">素材</div>
      </div>
      <div ref="designZoneRef" class="design-zone">
        <div
          v-for="(page, pageIndex) in thisManual.pages"
          :key="pageIndex"
          :style="page.pageInfo.background + pageHeight"
          class="muse-page"
          @mouseenter="pageEditBtnVisible = true"
          @mouseleave="pageEditBtnVisible = false"
        >
          <div v-if="pageEditBtnVisible" class="page-edit-btn-container" style="cursor: pointer">
            <el-icon class="page-edit-btn" @click="addPageHandler(pageIndex)">
              <Plus />
            </el-icon>
            <el-icon class="page-edit-btn" @click="editPageHandler(pageIndex)">
              <Edit />
            </el-icon>
            <el-icon class="page-edit-btn" @click="deletePageHandler(pageIndex)">
              <Close />
            </el-icon>
          </div>
          <el-dialog v-model="pageEditDialogVisible" title="上传文件"> s</el-dialog>
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
              :w="item.w"
              :x="item.x"
              :y="item.y"
              class="grid-item"
              @moved="componentMovedHandler"
              @resized="componentResizedHandler"
            >
              <general-component
                :component-props="item.componentProps"
                :i="item.i"
                :showDelete="true"
                :type="item.type"
                style="background: transparent"
                @delete-component="deleteComponentHandler(pageIndex, componentIndex)"
                @choose-component="chooseComponentHandler(pageIndex, componentIndex)"
              />
            </grid-item>
          </grid-layout>
        </div>
      </div>
      <div class="props-editor">
        <div v-if="thisManual.pages.length !== 0" class="editor-form" style="margin-bottom: 5%">
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
          <div v-if="chosenComponent.componentIndex >= 0" class="editor-form">
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
          <div v-if="chosenComponent.componentIndex >= 0" class="editor-form">
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
          <div v-if="chosenComponent.componentIndex >= 0" class="editor-form" style="font-size: 14px">
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
          <div v-if="chosenComponent.componentIndex >= 0" class="editor-form" style="font-size: 14px">
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
.manual-design {
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
      width: 57%;
      height: 100%;
      overflow-y: scroll;

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
