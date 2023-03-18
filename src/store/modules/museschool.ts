import store from "@/store"
import { defineStore } from "pinia"
import { Component } from "museschool"
import { reactive } from "vue"

export const useMuseschoolStore = defineStore("Museschool", () => {
  const componentList: Component[] = reactive([])
  return { componentList }
})

/** 在 setup 外使用 */
export function useMuseschoolStoreHook() {
  return useMuseschoolStore(store)
}
