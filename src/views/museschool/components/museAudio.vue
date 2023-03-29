<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { VideoPause, VideoPlay } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import canon from "@/assets/museschool/canon.mp3"

//音频组件参数格式
// componentProps: { url: "", background: ""}
const props = defineProps(["componentProps"])

//组件样式
const componentStyle = ref("")

//是否获取到音频
let ifGetAudio = false

//是否正在播放
const ifPlaying = ref(false)

//音频对象
const audio = new Audio()

onMounted(async () => {
  //解析componentProps
  if (props.componentProps.background != null) {
    componentStyle.value = componentStyle.value + "background:" + props.componentProps.background + ";"
  }
  if (props.componentProps.url != null) {
    audio.src = canon
    ifGetAudio = true
  }
})

//播放/暂停音乐
async function playPauseAudio() {
  if (ifGetAudio) {
    if (ifPlaying.value) {
      audio.pause() // 暂停
    } else {
      await audio.play() // 播放
    }
    ifPlaying.value = !ifPlaying.value
  } else {
    ElMessage("未获取到音频")
  }
}
</script>

<template>
  <div :style="componentStyle" class="app-container">
    <el-icon class="el-icon">
      <VideoPlay v-if="ifPlaying" @click="playPauseAudio" />
      <VideoPause v-if="!ifPlaying" @click="playPauseAudio" />
    </el-icon>
    <el-icon />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;

  .el-icon {
    width: 100%;
    height: 100%;
  }
}
</style>
