import { request } from "@/utils/service"

/** 获取一段时间的用户新增数量 */
interface IGetNewUserApi {
  beginDate: string
  endDate: string
  museumId: number
}

/** 获取前k个热门及热度值的type */
interface IGetHotTopicApi {
  k: number
  museumId: number
}

/** 获取一段时间的用户新增数量 */
export function getNewUserApi(params: IGetNewUserApi) {
  return request({
    url: "data-analysis/new-user",
    method: "get",
    params
  })
}

/** 获取前k个热门展区及其热度值 */
export function getHotHallApi(params: IGetHotTopicApi) {
  return request({
    url: "data-analysis/trending-hall",
    method: "get",
    params
  })
}

/** 获取前k个热门展品及其热度值 */
export function getHotExhibitApi(params: IGetHotTopicApi) {
  return request({
    url: "data-analysis/trending-exhibit",
    method: "get",
    params
  })
}
