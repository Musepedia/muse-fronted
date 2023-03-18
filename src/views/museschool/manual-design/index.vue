<script lang="ts" setup>
import GeneralComponent from "@/views/museschool/components/generalComponent.vue"
import { onMounted, reactive, ref } from "vue"

const gridlayout = ref(null)
const designZone = ref(null)

const title = ref("研学手册标题")
const chosenComponent = ref("")

interface Component {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
  maxW: number
  maxH: number
  type: string
  componentProps?: {
    content?: string
    fontSize?: string
    fontWeight?: string
    color?: string
    background?: string
    url?: string
  } | null
}

//原型组件列表
const prototypeComponentList = reactive([
  {
    i: "-1",
    type: "0",
    componentProps: { content: "文本组件" }
  },
  {
    i: "-2",
    type: "1",
    componentProps: {
      url: "https://northpicture.oss-cn-shanghai.aliyuncs.com/img/202302202247827.png"
    }
  }
])

//gridlayout列数，行高
const colNum = ref(50)
const rowHeight = ref(10)

//组件列表
const componentList: Component[] = reactive([
  {
    i: "1",
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    minW: 1,
    minH: 1,
    maxW: 20,
    maxH: 20,
    type: "0",
    componentProps: {
      content: "文本内容",
      fontSize: "50px",
      fontWeight: "bold",
      color: "red",
      background: "#fffaaa"
    }
  },
  {
    i: "2",
    x: 0,
    y: 4,
    w: 10,
    h: 10,
    minW: 1,
    minH: 1,
    maxW: 20,
    maxH: 20,
    type: "1",
    componentProps: {
      url: "https://northpicture.oss-cn-shanghai.aliyuncs.com/img/202302202247827.png"
    }
  }
])

const changeComponent = () => {
  componentList[0].componentProps!.content = "asdasdasd"
}

//监测鼠标位置
const mouseXY = { x: 0, y: 0 }

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

function dragend(index: Number) {
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
          fontSize: "",
          fontWeight: "",
          color: "",
          background: ""
        }
        break
      case 1:
        componentProps = {
          url: "https://northpicture.oss-cn-shanghai.aliyuncs.com/img/202302202247827.png",
          background: ""
        }
        break
    }

    let i: string
    if (componentList.length > 0) {
      i = (Number(componentList[componentList.length - 1].i) + 1).toString()
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
    chosenComponent.value = component.i
    componentList.push(component)
  }
}

//删除组件
function deleteComponent(i: string) {
  // 移除数组中i==1的项
  const index = componentList.findIndex(function (item) {
    return item.i == i
  })
  if (index > -1) {
    componentList.splice(index, 1)
  }
  if (chosenComponent.value == i) {
    chosenComponent.value = ""
  }
}

//选择组件
function chooseComponent(i: string) {
  chosenComponent.value = i
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
      <div class="title">{{ title }}</div>
      <div class="show-export">
        <el-button color="#2565F1" icon="Monitor" @click="changeComponent">演示</el-button>
        <el-button color="#FFFFFF" icon="Download">导出</el-button>
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
          ref="gridlayout"
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
      <div class="props-modification">修改参数</div>
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
    justify-content: center;
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
      margin-right: 30%;

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

    .show-export {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 30%;
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

    .props-modification {
      width: 18%;
      height: 100%;
      background: #ffffff;
      overflow-y: scroll;
    }
  }
}
</style>
