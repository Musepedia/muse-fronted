<script lang="ts" setup>
// import { reactive, ref, watch } from "vue"
// import { useRouter } from "vue-router"
//
// const router = useRouter()
import { computed, onMounted, reactive } from "vue"
import museText from "./museText.vue"
import museImage from "./museImage.vue"

const props = defineProps(["i", "type", "componentProps"])

const componentList = reactive([museText, museImage])
const currentComponent = computed(() => {
  return componentList[props.type]
})

onMounted(() => {
  console.log(props.type)
  console.log(props.componentProps)
})
</script>

<template>
  <div class="app-container">
    <component :is="currentComponent" :componentProps="props.componentProps" :i="props.i" class="the-component" />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;

  .the-component {
    width: 100%;
    height: 100%;
  }
}
</style>
