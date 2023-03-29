import store from "@/store"
import { defineStore } from "pinia"
import { Manual } from "museschool"
import { reactive, ref } from "vue"

export const useMuseschoolStore = defineStore("Museschool", () => {
  const manual: Manual = reactive({ id: -1, title: "-1", componentList: [] })
  const exportManual = ref()
  return { manual, exportManual }
})

/** 在 setup 外使用 */
export function useMuseschoolStoreHook() {
  return useMuseschoolStore(store)
}
