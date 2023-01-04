<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { useUserStoreHook } from "@/store/modules/user"
import { type FormInstance, FormRules } from "element-plus"
import { type UserData, type UpdateUserData, getMuseInfo, updateUserInfo } from "@/api/userInfo"

const userStore = useUserStoreHook()
const UserFormRef = ref<FormInstance | null>(null)
const emails = ref<any>([])
const phones = ref<any>([])

/** 用户表单数据 */
const UserForm: UserData = reactive({
  username: "",
  nickname: "",
  role: "",
  email: "",
  phone: "",
  museum: ""
})
/** 用户表单校验规则 */
const UserFormRules: FormRules = {
  nickname: [{ required: true, message: "请输入新的昵称", trigger: "blur" }],
  email: [{ required: true, message: "请输入新的邮箱", trigger: "blur" }],
  phone: [{ required: true, message: "请输入新的电话号码", trigger: "blur" }]
}
/** 获取用户个人信息 */
const createInfo = () => {
  UserForm.username = ""
  UserForm.nickname = ""
  UserForm.role = ""
  UserForm.email = ""
  UserForm.phone = ""
  UserForm.museum = ""
  userStore.getInfo()
  UserForm.username = userStore.username
  UserForm.nickname = userStore.nickname
  UserForm.role = userStore.roleDescript
  UserForm.email = userStore.email
  emails.value = [{ value: userStore.email }]
  UserForm.phone = userStore.phone
  phones.value = [{ value: userStore.phone }]
  const id = userStore.museumID as number
  if (id === null) {
    UserForm.museum = "暂无"
  } else {
    getMuseInfo(userStore.museumID as number).then((res: any) => {
      UserForm.museum = res.data.data.name
    })
  }
}
const setUserFormVisible = ref(false)
/** 提交修改按钮 Loading */
const editLoading = ref(false)
/** 修改表单可见状态 */
const openUserEdit = () => {
  setUserFormVisible.value = true
}
const oldEmail = (queryString: any, callback: any) => {
  const email = emails.value
  const results = queryString ? email.filter(createFilter(queryString)) : email
  callback(results)
}
const oldPhone = (queryString: any, callback: any) => {
  const phone = phones.value
  const results = queryString ? phone.filter(createFilter(queryString)) : phone
  callback(results)
}
const createFilter = (queryString: any) => {
  return (nickname: any) => {
    return nickname.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
/** 处理自动填补 */
const handleSelect1 = (item: any) => {
  UserForm.email = item.value
}
const handleSelect2 = (item: any) => {
  UserForm.phone = item.value
}
/** 修改个人信息 */
const handleUserEdit = () => {
  UserFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      editLoading.value = true
      updateUserInfo({
        email: UserForm.email,
        nickname: UserForm.nickname,
        phone: UserForm.phone
      })
        .then(() => {
          setUserFormVisible.value = false
          location.reload()
        })
        .finally(() => {
          editLoading.value = false
        })
    }
  })
}
createInfo()
</script>

<template>
  <div class="app-container center">
    <el-descriptions class="margin-top" title="个人信息" :column="2" border>
      <template v-slot:extra>
        <el-button type="primary" @click="openUserEdit">修改</el-button>
      </template>
      <el-descriptions-item label="用户名">{{ userStore.username }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ userStore.nickname }}</el-descriptions-item>
      <el-descriptions-item label="身份">{{ UserForm.role }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userStore.email }}</el-descriptions-item>
      <el-descriptions-item label="电话">{{ userStore.phone }}</el-descriptions-item>
      <el-descriptions-item label="博物馆">{{ UserForm.museum }}</el-descriptions-item>
    </el-descriptions>
  </div>

  <el-dialog title="修改个人信息" v-model="setUserFormVisible" :close-on-click-modal="false">
    <el-form :model="UserForm" label-width="80px" :rules="UserFormRules" ref="UserFormRef">
      <el-row>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="UserForm.nickname" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-autocomplete
            class="inline-input"
            v-model="UserForm.email"
            :fetch-suggestions="oldEmail"
            @select="handleSelect1"
          />
          <!-- <el-input v-model="UserForm.email" auto-complete="off" /> -->
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-autocomplete
            class="inline-input"
            v-model="UserForm.phone"
            :fetch-suggestions="oldPhone"
            @select="handleSelect2"
          />
          <!-- <el-input v-model="UserForm.phone" auto-complete="off" /> -->
        </el-form-item>
      </el-row>
      <el-button @click="setUserFormVisible = false">取消</el-button>
      <el-button type="primary" @click="handleUserEdit" :loading="editLoading">提交</el-button>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped>
.center {
  height: 100%;
  //display: flex;
  justify-content: left;
  align-items: top;
}
:deep(.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell) {
  padding: 10px 45px;
  //text-align: center;
  line-height: 26px;
}
</style>
