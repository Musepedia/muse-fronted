import store from "@/store"
import { defineStore } from "pinia"
import { Component } from "museschool"
import { reactive, ref } from "vue"

export const useMuseschoolStore = defineStore("Museschool", () => {
  const componentList: Component[] = reactive([])
  const manualTitle = ref()
  const exportManual = ref()
  return { componentList, manualTitle, exportManual }
})

/** 在 setup 外使用 */
export function useMuseschoolStoreHook() {
  return useMuseschoolStore(store)
}
