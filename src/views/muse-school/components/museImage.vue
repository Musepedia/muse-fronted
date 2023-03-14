<script lang="ts" setup>
// import { reactive, ref, watch } from "vue"
// import { useRouter } from "vue-router"
//
// const router = useRouter()
import { onMounted, ref } from "vue"

const props = defineProps(["i", "componentProps"])
const url = ref("https://northpicture.oss-cn-shanghai.aliyuncs.com/img/202302202247827.png")
onMounted(() => {
  console.log(props)
  const newId = "museText-" + props.i
  const appContainer = document.getElementById("museText")
  if (appContainer !== null) {
    appContainer.id = newId
  } else {
    console.error("cannot find appContainer")
  }
})
</script>

<template>
  <div id="museImage" class="app-container">
    <el-image :src="url" class="image1" />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  background-color: wheat;
  border: 1px solid #c9c9c9;

  .image1 {
    width: 100%;
  }
}
</style>
