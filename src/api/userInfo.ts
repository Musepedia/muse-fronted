import { request } from "@/utils/service"

export interface UserData {
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 身份 */
  role: string
  /** 邮箱 */
  email: string
  /** 联系电话 */
  phone: string
  /** 所属博物馆 */
  museum: string
}

export interface UpdateUserData {
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email: string
  /** 联系电话 */
  phone: string
}

export interface setpwdData {
  /** 旧密码 */
  oldPassword: string
  /** 新密码 */
  newPassword: string
}

/** 根据ID获取博物馆信息 */
export function getMuseInfo(id: number) {
  return request({
    url: `museum/${id}`,
    method: "get"
  })
}

/** 修改用户个人信息 */
export function updateUserInfo(data: UpdateUserData) {
  return request({
    url: "user/info",
    method: "put",
    data
  })
}

/** 修改密码 */
export function setUserpwd(data: setpwdData) {
  return request({
    url: "user/reset-password",
    method: "post",
    data
  })
}
