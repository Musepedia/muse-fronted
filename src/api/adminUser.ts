import { request } from "@/utils/service"

interface IAddUserApi {
  username: string
  password: string
  nickname: string
  email: string
  phone: string
  institutionId: number | undefined
  roleIds: number[]
}

interface IUpdateUserApi {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  institutionId: number | undefined
  roleIds: number[]
}

interface IResetUserPwdApi {
  password: string
  userId: number
}

interface IGetUserListApi {
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
export function addUserApi(data: IAddUserApi) {
  return request({
    url: "admin/user",
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
export function updateUserApi(data: IUpdateUserApi) {
  return request({
    url: "admin/user",
    method: "put",
    data
  })
}

export function resetUserPwdApi(data: IResetUserPwdApi) {
  return request({
    url: "admin/user/password",
    method: "put",
    data
  })
}

/** 查 */
export function getUserListApi(params: IGetUserListApi) {
  return request({
    url: "admin/user/list",
    method: "get",
    params
  })
}

export function getRoleListApi() {
  return request({
    url: "user/list",
    method: "get"
  })
}
