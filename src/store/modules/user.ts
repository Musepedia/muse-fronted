import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { type ILoginData, loginApi, getUserInfoApi } from "@/api/login"
import { type RouteRecordRaw } from "vue-router"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const roleDescript = ref<string>("")
  const username = ref<string>("")
  const nickname = ref<string>("")
  const email = ref<string>("")
  const phone = ref<string>("")
  const museumID = ref<number>()
  const enabled = ref(true)

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = (loginData: ILoginData) => {
    return new Promise((resolve, reject) => {
      loginApi({
        username: loginData.username,
        password: loginData.password,
        code: loginData.code,
        uuid: loginData.uuid
      })
        .then((res: any) => {
          setToken(res.headers["x-auth-token"])
          token.value = res.headers["x-auth-token"]
          //console.log(roles)
          username.value = res.data.data.username
          enabled.value = res.data.data.enabled
          resolve(true)
        })
        .catch((error) => {
          reject(error.message)
          // console.log(error)
        })
    })
  }
  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((res: any) => {
          roles.value[0] = res.data.data.roles[0].name
          roleDescript.value = res.data.data.roles[0].description
          //console.log(res)
          username.value = res.data.data.username
          nickname.value = res.data.data.nickname
          email.value = res.data.data.email
          phone.value = res.data.data.phone
          museumID.value = res.data.data.institutionId
          enabled.value = res.data.data.enabled
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    const permissionStore = usePermissionStore()
    // console.log(roles.value)
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return {
    token,
    roles,
    roleDescript,
    email,
    phone,
    museumID,
    username,
    nickname,
    enabled,
    setRoles,
    login,
    getInfo,
    changeRoles,
    logout,
    resetToken
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
