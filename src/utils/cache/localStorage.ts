/** 统一处理 localStorage */

import CacheKey from "@/constants/cacheKey"
import { type ThemeName } from "@/hooks/useTheme"
import { Manual, MuseschoolImage } from "museschool"

export const getSidebarStatus = () => {
  return localStorage.getItem(CacheKey.SIDEBAR_STATUS)
}
export const setSidebarStatus = (sidebarStatus: "opened" | "closed") => {
  localStorage.setItem(CacheKey.SIDEBAR_STATUS, sidebarStatus)
}

export const getActiveThemeName = () => {
  return localStorage.getItem(CacheKey.ACTIVE_THEME_NAME) as ThemeName
}
export const setActiveThemeName = (themeName: ThemeName) => {
  localStorage.setItem(CacheKey.ACTIVE_THEME_NAME, themeName)
}

export const getManual = () => {
  const data = localStorage.getItem(CacheKey.MANUAL)
  return data ? JSON.parse(data) : { id: null, title: null, componentList: [] }
}

export const setManual = (manual: Manual) => {
  localStorage.setItem(CacheKey.MANUAL, JSON.stringify(manual))
}

export const getUploadedImages = () => {
  const data = localStorage.getItem(CacheKey.UPLOADEDIMAGES)
  return data ? JSON.parse(data) : []
}

export const setUploadedImages = (images: MuseschoolImage[]) => {
  localStorage.setItem(CacheKey.UPLOADEDIMAGES, JSON.stringify(images))
}
