<script lang="ts" setup>
// import { reactive, ref, watch } from "vue"
// import { useRouter } from "vue-router"
//
// const router = useRouter()
import { onMounted } from "vue"

const props = defineProps(["i", "componentProps"])

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
  <div id="museText" class="app-container">
    <h3>文本组件</h3>
    <span>{{ props.componentProps.content }}</span>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  background-color: wheat;
  border: 1px solid #c9c9c9;
}
</style>
