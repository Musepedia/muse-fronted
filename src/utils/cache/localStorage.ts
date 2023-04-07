/** 统一处理 localStorage */

import CacheKey from "@/constants/cacheKey"
import { type ThemeName } from "@/hooks/useTheme"
import { Component } from "museschool"

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

export const getComponentList = () => {
  return JSON.parse(localStorage.getItem(CacheKey.COMPONENT_LIST)!)
}

export const setComponentList = (componentList: Component[]) => {
  localStorage.setItem(CacheKey.COMPONENT_LIST, JSON.stringify(componentList))
}
