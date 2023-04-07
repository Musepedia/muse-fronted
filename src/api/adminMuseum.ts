import { request } from "@/utils/service"
import { getToken } from "@/utils/cache/cookies"
import qs from "qs"

/** 查 */
interface IGetMuseumListApi {
  current: number
  size: number
  name?: string
  createTime?: number[]
  updateTime?: number[]
  order?: string
}
/** 增 */
interface IAddMuseumApi {
  /** 博物馆名称 */
  name: string
  /** 博物馆地址 */
  address: string
  /** 博物馆描述 */
  description: string
  /** 经纬度 */
  longitude: number
  latitude: number
  logoUrl: string
  imageUrl: string
}
/** 改 */
interface IUpdateMuseumApi {
  id: number
  /** 博物馆名称 */
  name: string
  /** 博物馆地址 */
  address: string
  /** 博物馆描述 */
  description: string
  /** 经纬度 */
  longitude: number
  latitude: number
  logoUrl: string
  imageUrl: string
}

/** 更新博物馆经营状态 */
interface IChangeMuseumServiceApi {
  id: number
  service: boolean
}

/** 查 */
export function getMuseumListApi(params: IGetMuseumListApi) {
  return request({
    url: "museum/list",
    method: "get",
    params
  })
}

/** 根据ID获取博物馆信息 */
export function getMuseInfoById(id: number) {
  return request({
    url: `museum/${id}`,
    method: "get"
  })
}

/** 增 */
export function addMuseumApi(data: IAddMuseumApi) {
  return request({
    url: "museum",
    method: "post",
    data
  })
}

/** 改 */
export function updateMuseumApi(data: IUpdateMuseumApi) {
  return request({
    url: "museum",
    method: "put",
    data
  })
}

/** 更新博物馆经营状态 */
export function changeMuseumServiceApi(data: IChangeMuseumServiceApi) {
  return request({
    url: "museum/service",
    method: "put",
    data
  })
}

/** 上传文件 */
export function uploadFile(data: FormData) {
  return request({
    headers: {
      Authorization: "Bearer " + getToken(),
      "x-auth-token": getToken(),
      "Content-Type": "multipart/form-data"
    },
    url: "file",
    method: "post",
    data
  })
}
