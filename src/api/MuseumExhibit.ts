import { request } from "@/utils/service"

/** 获取展品列表 */
interface IGetExhibitListApi {
  current: number
  size: number
  /** 所在博物馆ID */
  museumId: number
  /** 所在展区ID */
  exhibitionHallId: number
  /** 展品名称 */
  label?: string
  /** 排序字段 */
  order?: string
  createTime?: string[]
  updateTime?: string[]
}

/** 增/改 */
// 产品信息
interface IAddExhibitApi {
  id?: number
  /** 展品名称 */
  label: string
  description: string
  figureUrl: string
  figureUrlList: string[]
  hallId: number
  nextId?: number
  prevId?: number
}
//产品别名
interface IUpdateExhibitAliasApi {
  exhibitAlias: string[]
  exhibitId: number
}
//产品文本
interface IUpdateExhibitTextApi {
  exhibitText: string[]
  exhibitId: number
}
//产品状态
interface IChangeExhibitEnableApi {
  id: number
  enable: boolean
}

/** 查 */
// 获取展品列表
export function getExhibitListApi(params: IGetExhibitListApi) {
  return request({
    url: "exhibit/list",
    method: "get",
    params
  })
}
//获取展品别名
export function getExhibitAliasApi(id: number) {
  return request({
    url: `exhibit/${id}/alias`,
    method: "get"
  })
}
//获取展品文本
export function getExhibitTextApi(id: number) {
  return request({
    url: `exhibit/${id}/text`,
    method: "get"
  })
}

/** 增 */
export function addExhibitApi(data: IAddExhibitApi) {
  return request({
    url: "exhibit",
    method: "post",
    data
  })
}

/** 改 */
//改展品信息
export function updateExhibitApi(data: IAddExhibitApi) {
  return request({
    url: "exhibit",
    method: "put",
    data
  })
}
//改展品别名
export function updateExhibitAliasApi(data: IUpdateExhibitAliasApi) {
  return request({
    url: "exhibit/alias",
    method: "put",
    data
  })
}
//改展品文本
export function updateExhibitTextApi(data: IUpdateExhibitTextApi) {
  return request({
    url: "exhibit/text",
    method: "put",
    data
  })
}
//改展品启用状态
export function changeExhibitEnableApi(data: IChangeExhibitEnableApi) {
  return request({
    url: "exhibit/enable",
    method: "put",
    data
  })
}
