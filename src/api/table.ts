import { request } from "@/utils/service"

interface ICreateTableDataApi {
  username: string
  password: string
}

interface IUpdateTableDataApi {
  id: string
  username: string
  password?: string
}

interface IGetTableDataApi {
  /** 当前页码 */
  current: number
  /** 查询条数 */
  size: number
  /** 查询参数 */
  nickname?: string
  createTime?: string[]
  updateTime?: string[]
}

/** 增 */
export function createTableDataApi(data: ICreateTableDataApi) {
  return request({
    url: "table",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: string) {
  return request({
    url: `table/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: IUpdateTableDataApi) {
  return request({
    url: "table",
    method: "put",
    data
  })
}

/** 查 */
export function getUserList(params: IGetTableDataApi) {
  return request({
    url: "admin/user/list",
    method: "get",
    params
  })
}
