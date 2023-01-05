<script lang="ts" setup>
import { computed, ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { useAppStore } from "@/store/modules/app"
import { useSettingsStore } from "@/store/modules/settings"
import { useUserStore } from "@/store/modules/user"
import { UserFilled } from "@element-plus/icons-vue"
import Breadcrumb from "../Breadcrumb/index.vue"
import Hamburger from "../Hamburger/index.vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Screenfull from "@/components/Screenfull/index.vue"
import Notify from "@/components/Notify/index.vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { type setpwdData, setUserpwd } from "@/api/userInfo"
import { conditionalExpression } from "@babel/types"

const router = useRouter()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const setpwdFormVisible = ref(false)
const setpwdFormRef = ref<FormInstance | null>(null)
/** 提交修改按钮 Loading */
const editLoading = ref(false)

/** 修改密码的表单数据 */
const setpwdForm: any = reactive({
  oldpassword: "",
  newpassword: "",
  confirmpassword: ""
})
/** 修改密码表单的可见状态 */
const openSetpwdForm = () => {
  setpwdFormVisible.value = true
}

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入新密码"))
  } else if (value.length < 8) {
    callback(new Error("密码长度请大于8"))
  } else {
    if (setpwdForm.confirmpassword !== "") {
      if (!setpwdFormRef.value) return
      setpwdFormRef.value.validateField("confirmpassword", () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"))
  } else if (value !== setpwdForm.newpassword) {
    callback(new Error("两次输入密码不一致!"))
  } else {
    callback()
  }
}
/** 修改密码表单校验规则 */
const setpwdFormRules: FormRules = {
  oldpassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newpassword: [{ required: true, validator: validatePass, trigger: "blur" }],
  confirmpassword: [{ required: true, validator: validatePass2, trigger: "blur" }]
}
/** 提交修改密码 */
const handlepwdEdit = () => {
  setpwdFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      editLoading.value = true
      console.log(setpwdForm.newpassword)
      setUserpwd({
        oldPassword: setpwdForm.oldpassword,
        newPassword: setpwdForm.newpassword
      })
        .then(() => {
          setpwdFormVisible.value = false
          logout()
          ElMessage.success("修改密码成功！请重新登录")
        })
        .finally(() => {
          editLoading.value = false
        })
    } else {
      return false
    }
  })
}

const sidebar = computed(() => {
  return appStore.sidebar
})
const showNotify = computed(() => {
  return settingsStore.showNotify
})
const showThemeSwitch = computed(() => {
  return settingsStore.showThemeSwitch
})
const showScreenfull = computed(() => {
  return settingsStore.showScreenfull
})

const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}
const logout = () => {
  userStore.logout()
  router.push("/login")
}
</script>

<template>
  <div class="navigation-bar">
    <Hamburger :is-active="sidebar.opened" class="hamburger" @toggle-click="toggleSidebar" />
    <Breadcrumb class="breadcrumb" />
    <div class="right-menu">
      <Screenfull v-if="showScreenfull" class="right-menu-item" />
      <ThemeSwitch v-if="showThemeSwitch" class="right-menu-item" />
      <Notify v-if="showNotify" class="right-menu-item" />
      <el-dropdown class="right-menu-item">
        <div class="right-menu-avatar">
          <el-avatar :icon="UserFilled" :size="30" />
          <span>{{ userStore.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <a target="_blank" href="https://pt.musepedia.cn">
              <el-dropdown-item>官网</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="openSetpwdForm">
              <span style="display: block">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 修改密码组件 -->
  <el-dialog title="修改密码" v-model="setpwdFormVisible" :close-on-click-modal="false" center>
    <el-form :model="setpwdForm" label-width="80px" :rules="setpwdFormRules" ref="setpwdFormRef">
      <el-row type="flex" justify="center" align="middle">
        <el-form-item label="原密码" prop="oldpassword">
          <el-input type="password" v-model="setpwdForm.oldpassword" auto-complete="off" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-form-item label="新密码" prop="newpassword">
          <el-input type="password" v-model="setpwdForm.newpassword" auto-complete="off" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-form-item label="确认密码" prop="confirmpassword">
          <el-input type="password" v-model="setpwdForm.confirmpassword" auto-complete="off" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-button @click="setpwdFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handlepwdEdit" :loading="editLoading">确认修改</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped>
.navigation-bar {
  height: var(--v3-navigationbar-height);
  overflow: hidden;
  background: #fff;
  .hamburger {
    display: flex;
    align-items: center;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
  }
  .breadcrumb {
    float: left;
    // 参考 Bootstrap 的响应式设计 WIDTH = 576
    @media screen and (max-width: 576px) {
      display: none;
    }
  }
  .right-menu {
    float: right;
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #606266;
    .right-menu-item {
      padding: 0 10px;
      cursor: pointer;
      .right-menu-avatar {
        display: flex;
        align-items: center;
        .el-avatar {
          margin-right: 10px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
