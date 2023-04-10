<script lang="ts" setup>
import MuseschoolHeader from "@/views/museschool/components/MuseschoolHeader.vue"
import { Picture } from "@element-plus/icons-vue"
import QRCode from "@/assets/museschool/homepage/QR_code.png"
import temp from "@/assets/museschool/homepage/temp.png"
import tutorial from "@/assets/museschool/homepage/tutorial.png"
import excellentManual from "@/assets/museschool/homepage/excellent_manual.png"
import newManual from "@/assets/museschool/homepage/new_manual.png"
import manual from "@/assets/museschool/homepage/manual.png"
import { onMounted, reactive, Ref, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

/* menu相关 ********************************************************************************************/
const menu = reactive([
  { name: "tutorial", img: tutorial, description: "手册新手指南" },
  { name: "tutorial", img: excellentManual, description: "优秀案例展示" },
  { name: "manual-design", img: newManual, description: "新建一个手册" }
])

/* main中元素宽高计算相关 ********************************************************************************************/
const carouselWidth: Ref<string> = ref("width:150px")
const carouselHeight: Ref<string> = ref("150px")
const menuHeight: Ref<string> = ref("height:150px")

/* 生命周期钩子 ********************************************************************************************/
onMounted(() => {
  // 计算main中元素宽高
  carouselHeight.value = (window.innerHeight * 0.77 * 0.35 - 20).toString() + "px"
  carouselWidth.value = "width:" + (window.innerHeight * 0.77 * 0.35 * (1920 / 448)).toString() + "px"
  menuHeight.value = "height:" + (window.innerHeight * 0.77 * 0.65).toString() + "px"
})
</script>

<template>
  <el-container class="homepage">
    <el-header class="header">
      <museschool-header active-name="homepage" />
    </el-header>
    <el-main class="main">
      <div class="carousel">
        <el-carousel :height="carouselHeight" :style="carouselWidth" trigger="click">
          <el-carousel-item v-for="item in 4" :key="item" style="width: 100%; height: 100%">
            <el-image :src="temp">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div :style="menuHeight" class="menu">
        <div class="menu-title">
          <el-image :src="manual" style="height: 80%">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <Picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <text>手册制作</text>
        </div>
        <div class="menu-description">
          <text>自由搭配，尝试制作一个博物馆研学手册吧！</text>
        </div>
        <div class="menu-bar">
          <div v-for="menuItem in menu" :key="menuItem.name" class="menu-item" @click="router.push(menuItem.name)">
            <div class="menu-item-img">
              <el-image :src="menuItem.img" style="height: 100%">
                <template #error>
                  <div class="image-slot">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="menu-item-description">
              <text>{{ menuItem.description }}</text>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer class="footer">
      <div class="QR-code">
        <el-image :src="QRCode" style="height: 70%">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <text>米弥特公众号</text>
      </div>
      <div class="introduction">
        <text>
          米弥特科技是来自华东师范大学的创业团队，目前致力于用科技为博物馆文旅赋能，为博物馆、学校和教育机构围绕导览、文创、教育和研学开发产品，并提供相应的解决方案。团队成员有计算机科学、软件工程、数据科学、统计学、经济学、教育学、美术和设计学等多学科背景，依托强大的技术实验室团队、深度资源整合能力以及开放性创意平台，致力于打造文化知识传播运营“求知、分享”生态圈。
        </text>
      </div>
    </el-footer>
  </el-container>
</template>

<style lang="scss" scoped>
.homepage {
  width: 100%;
  height: 100%;
  background: rgb(232, 233, 238);
  padding: 0;

  .header {
    width: 100%;
    height: 8%;
    padding: 0;
  }

  .main {
    width: 100%;
    height: 77%;
    padding: 0;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;

    .carousel {
      width: 100%;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .menu {
      width: 85%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #4c79dd;

      .menu-title {
        width: 100%;
        height: 10%;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: large;
        font-weight: bold;
      }

      .menu-description {
        width: 100%;
        height: 5%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .menu-bar {
        width: 100%;
        height: 50%;
        margin-top: 3%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .menu-item {
          height: 100%;
          width: 25%;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: large;
          font-weight: bold;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.17);
          color: #4c79dd;

          .menu-item-img {
            height: 70%;
            display: flex;
            margin-top: 3%;
            margin-bottom: 3%;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .menu-item-description {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: 15%;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background: #2565f1;
    color: #ffffff;

    .QR-code {
      height: 100%;
      width: 15%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-size: larger;
      font-weight: bolder;
    }

    .introduction {
      height: 70%;
      width: 50%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 25px;
    }
  }
}
</style>
