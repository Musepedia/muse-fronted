import store from "@/store"
import { defineStore } from "pinia"
import { MuseManual } from "museschool"
import { reactive, ref } from "vue"

export const useMuseschoolStore = defineStore("Museschool", () => {
  const manual: MuseManual = reactive({
    id: -1,
    title: "-1",
    nextComponentId: 1,
    pages: [{ page: 0, pageInfo: { nextId: 1, background: "background:white" }, componentList: [] }]
  })
  const exportManual = ref()
  return { manual, exportManual }
})

/** 在 setup 外使用 */
export function useMuseschoolStoreHook() {
  return useMuseschoolStore(store)
}
