import store from "@/store"
import { defineStore } from "pinia"
import { MuseManual } from "museschool"
import { reactive, ref } from "vue"

export const useMuseschoolStore = defineStore("Museschool", () => {
  const manual: MuseManual = reactive({
    id: -1,
    title: "-1",
    nextComponentId: 1,
    ratio: true,
    pages: [{ page: 0, pageInfo: { background: "background:#ffffff" }, componentList: [] }]
  })
  const exportManual = ref()
  return { manual, exportManual }
})

/** 在 setup 外使用 */
export function useMuseschoolStoreHook() {
  return useMuseschoolStore(store)
}
