import { request } from "@/utils/museschoolService"
import { Component } from "museschool"

//saveLocation接口数据
export interface saveLocationData {
  name: string
  x: number
  y: number
  width: number
  minWidth: number
  maxWidth: number
  height: number
  minHeight: number
  maxHeight: number
  typeId: number
  content: string
}

//用于处理请求参数，将componentProps转化为字符串的组件
interface stringifiedComponent {
  componentId: string
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
  typeId: number
  content: string
}

//saveResearchList接口数据
export interface saveResearchListData {
  title: string
  components: stringifiedComponent[]
}

//updateResearchListById接口数据
export interface updateResearchListByIdData {
  id: number
  title: string
  components: stringifiedComponent[]
}

//getResearchListById接口数据
export interface getResearchListByIdData {
  id: number
}

//保存组件
export function saveLocation(data: saveLocationData) {
  return request({
    url: "/saveLocation",
    method: "POST",
    data
  })
}

//处理请求数据，将componentProps转化为字符串
function stringifyComponent(id: number, title: string, componentList: Component[]) {
  const stringifiedComponentList: stringifiedComponent[] = []
  for (let i = 0; i < componentList.length; i++) {
    stringifiedComponentList.push({
      componentId: componentList[i].i,
      x: componentList[i].x,
      y: componentList[i].y,
      width: componentList[i].w,
      height: componentList[i].h,
      minWidth: componentList[i].minW,
      minHeight: componentList[i].minH,
      maxWidth: componentList[i].maxW,
      maxHeight: componentList[i].maxH,
      typeId: componentList[i].type,
      content: JSON.stringify(componentList[i].componentProps)
    })
  }
  if (id < 0) {
    const data: saveResearchListData = {
      title: title,
      components: stringifiedComponentList
    }
    return data
  } else {
    const data: updateResearchListByIdData = {
      id: id,
      title: title,
      components: stringifiedComponentList
    }
    console.log(data)
    return data
  }
}

//保存研学清单
export function saveResearchList(title: string, componentList: Component[]) {
  return request({
    url: "/saveResearchList",
    method: "POST",
    data: stringifyComponent(-1, title, componentList)
  })
}

//根据id更新研学清单
export function updateResearchListById(id: number, title: string, componentList: Component[]) {
  return request({
    url: "/updateResearchListById",
    method: "POST",
    data: stringifyComponent(id, title, componentList)
  })
}

//根据id获取研学清单
export function getResearchListById(data: getResearchListByIdData) {
  return request({
    url: "/getResearchListById?id=1",
    method: "POST",
    data
  })
}
