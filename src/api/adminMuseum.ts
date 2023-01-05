import { request } from "@/utils/service"

interface IGetMuseumListApi {
  current: number
  size: number
  name?: string
  createTime?: string[]
  updateTime?: string[]
}
/** 查 */
export function getMuseumListApi(params: IGetMuseumListApi) {
  return request({
    url: "museum/list",
    method: "get",
    params
  })
}
