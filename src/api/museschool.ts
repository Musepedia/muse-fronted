import { request } from "@/utils/museschoolService"

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

//保存布局
export function saveLocation(data: saveLocationData) {
  return request({
    url: "/saveLocation",
    method: "POST",
    data
  })
}
