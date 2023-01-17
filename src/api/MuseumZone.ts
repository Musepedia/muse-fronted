import { request } from "@/utils/service"

/** 获取展区列表 */
interface IGetZoneListApi {
  current: number
  size: number
  museumId: number
  name?: string
  createTime?: string[]
  updateTime?: string[]
  order?: string
}

/** 增/改 */
interface IAddZoneApi {
  name: string
  description: string
  imageUrl: string
  museumId: number
  id?: number
}
/** 改启用状态 */
interface IChangeZoneEnableApi {
  id: number
  enable: boolean
}

/** 展区接口 */
/** 查 */
export function getZoneListApi(params: IGetZoneListApi) {
  return request({
    url: "hall/list",
    method: "get",
    params
  })
}

/** 增 */
export function addZoneApi(data: IAddZoneApi) {
  return request({
    url: "hall",
    method: "post",
    data
  })
}

/** 改 */
export function updateZoneApi(data: IAddZoneApi) {
  return request({
    url: "hall",
    method: "put",
    data
  })
}

/** 更新展区启用状态 */
export function changeZoneEnableApi(data: IChangeZoneEnableApi) {
  return request({
    url: "hall/enable",
    method: "put",
    data
  })
}
