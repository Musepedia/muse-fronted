<script lang="ts" setup>
import { Picture } from "@element-plus/icons-vue"
import museschool_logo from "@/assets/museschool/museschool_logo.png"
import { onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

//组件参数
const props = defineProps(["activeName"])

/* 导航栏相关 ********************************************************************************************/
const activeName = ref("homepage")
const navigators = reactive([
  {
    value: "首页",
    name: "homepage"
  },
  {
    value: "我的手册",
    name: "user-manual"
  },
  {
    value: "教程培训",
    name: "tutorial"
  },
  {
    value: "风格模版",
    name: "manual-template"
  }
])

//跳转
function navigateTo(name: string) {
  console.log(name)
  router.push({ name: name })
}

/* 生命周期钩子 ********************************************************************************************/
onMounted(() => {
  activeName.value = props.activeName
})
</script>

<template>
  <div class="museschool-header">
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
    <div class="navigation-bar">
      <div
        v-for="navigator in navigators"
        :key="navigator.name"
        :style="activeName === navigator.name ? 'background: #719eff' : ''"
        class="navigator"
        @click="navigateTo(navigator.name)"
      >
        {{ navigator.value }}
      </div>
    </div>
    <div class="avatar-container">
      <el-avatar icon="UserFilled" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.museschool-header {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  background: linear-gradient(270deg, rgba(121, 162, 254, 1), rgba(37, 101, 241, 1));
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.17);

  .logo {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    color: #ffffff;
    font-size: 29px;
    font-weight: bold;
    margin-left: 5%;
  }

  .navigation-bar {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    .navigator {
      height: 100%;
      width: 10vh;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      font-weight: bold;

      color: #ffffff;

      &:hover {
        background: #719eff;
      }
    }
  }

  .avatar-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 5%;
  }
}
</style>
