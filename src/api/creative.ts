import { request } from "@/utils/service"

/** 获取文创列表 */
interface IGetCreativeListApi {
  current: number
  size: number
  museumId: number
  name?: string
  createTime?: string[]
  updateTime?: string[]
  order?: string
}

/** 增加文创 */
interface IAddCreativeApi {
  id?: number
  name: string
  description: string
  museumId: number
  imageList: string[]
  deleted: boolean
}

/**
 * 文创接口
 */
/** 查 */
export function getCreativeListApi(params: IGetCreativeListApi) {
  return request({
    url: "creative/list",
    method: "get",
    params
  })
}

/** 增 */
export function addCreativeApi(data: IAddCreativeApi) {
  return request({
    url: "creative",
    method: "post",
    data
  })
}

/** 改 */
export function updateCreativeApi(data: IAddCreativeApi) {
  return request({
    url: "creative",
    method: "put",
    data
  })
}
