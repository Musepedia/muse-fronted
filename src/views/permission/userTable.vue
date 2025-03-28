<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  addUserApi,
  changeStatesApi,
  getRoleListApi,
  getUserListApi,
  resetUserPwdApi,
  updateUserApi
} from "@/api/adminUser"
import { getMuseInfoById, getMuseumListApi } from "@/api/adminMuseum"
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus"
import { CirclePlus, Download, Refresh, RefreshRight, Search } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  username: "",
  nickname: "",
  password: "",
  email: "",
  phone: "",
  role: "",
  institution: ""
})
const formRules: FormRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  nickname: [{ required: true, trigger: "blur", message: "请输入昵称" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  email: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
  phone: [{ required: false, trigger: "blur", message: "请输入电话" }]
})
const handleOpenAdd = () => {
  dialogVisible.value = true
  getRoleList()
  getMuseumList()
}
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addUserApi({
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname,
          email: formData.email,
          phone: formData.phone,
          roleIds: roleChosen.value,
          institutionId: museumChosen.value
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getUserList()
        })
      } else {
        updateUserApi({
          id: currentUpdateId.value,
          username: formData.username,
          nickname: formData.nickname,
          email: formData.email,
          phone: formData.phone,
          institutionId: museumChosen.value,
          roleIds: roleChosen.value
        }).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          getUserList()
        })
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.username = ""
  formData.nickname = ""
  formData.password = ""
  formData.email = ""
  formData.phone = ""
  formData.role = ""
  formData.institution = ""
  museumChosen.value = undefined
}
//#endregion

//#region 删--启用/禁用
// const handleDelete = (row: any) => {
//   ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning"
//   }).then(() => {
//     deleteTableDataApi(row.id).then(() => {
//       ElMessage.success("删除成功")
//       getUserList()
//     })
//   })
// }
const currentStates = ref<string>("")
const targetStates = ref<string>("")
const handleChange = (row: any) => {
  currentStates.value = row.enabled === true ? "启用" : "禁用"
  targetStates.value = row.enabled === false ? "启用" : "禁用"
  const data = [
    `当前用户: ${row.username}`,
    `当前状态为: ${currentStates.value}`,
    `切换状态为: ${targetStates.value}`,
    "确认切换？"
  ]
  let str = ""
  data.forEach((item) => {
    str += `${item}<br/>`
  })
  ElMessageBox.confirm(str, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    dangerouslyUseHTMLString: true,
    type: "warning",
    center: true
  }).then(() => {
    changeStatesApi({
      enable: !row.enabled,
      id: row.id
    }).then(() => {
      ElMessage.success("状态切换成功")
      getUserList()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  formData.username = row.username
  formData.nickname = row.nickname
  formData.email = row.email
  formData.phone = row.phone
  formData.role = row.role
  formData.institution = row.institution
  // formData.password = row.password
  dialogVisible.value = true
  getRoleList()
  getMuseumList()
}
/** 重置密码 */
const editLoading = ref(false)
const resetPwdFormVisible = ref<boolean>(false)
const resetPwdFormRef = ref<FormInstance | null>(null)
const resetPwdForm = reactive({
  password: "",
  confirmpassword: ""
})
const validatePass = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入新密码"))
  } else if (value.length < 8) {
    callback(new Error("密码长度请大于8"))
  } else {
    if (resetPwdForm.confirmpassword !== "") {
      if (!resetPwdFormRef.value) return
      resetPwdFormRef.value.validateField("confirmpassword", () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"))
  } else if (value !== resetPwdForm.password) {
    callback(new Error("两次输入密码不一致!"))
  } else {
    callback()
  }
}
/** 修改密码表单校验规则 */
const resetPwdFormRules: FormRules = {
  password: [{ required: true, validator: validatePass, trigger: "blur" }],
  confirmpassword: [{ required: true, validator: validatePass2, trigger: "blur" }]
}
const openReset = (row: any) => {
  currentUpdateId.value = row.id
  resetPwdFormVisible.value = true
}
const handleResetPwd = () => {
  resetPwdFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      editLoading.value = true
      resetUserPwdApi({
        password: resetPwdForm.password,
        userId: currentUpdateId.value as number
      })
        .then(() => {
          resetPwdFormVisible.value = false
          ElMessage.success("重置密码成功！")
        })
        .finally(() => {
          editLoading.value = false
        })
    } else {
      return false
    }
  })
}
//#endregion

//#region 查
/** 获取角色列表 */
const roleList = ref<any[]>([]) //角色列表
const roleChosen = ref<number[]>([]) //已选的角色
const getRoleList = () => {
  loading.value = true
  getRoleListApi()
    .then((res: any) => {
      roleList.value = res.data.data
    })
    .catch(() => {
      roleList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
/** formatter 角色数组的逐个呈现 */
const rolesData = (row: any) => {
  const arr: any[] = []
  row.roles.forEach((item: any, index: any) => {
    arr.push(item.name)
    if (index > 2) {
      return
    }
  })
  return arr.join(",")
}
const rolesData2 = (row: any) => {
  const arr: any[] = []
  row.roles.forEach((item: any, index: any) => {
    arr.push(item.createTime)
    if (index > 2) {
      return
    }
  })
  return arr.join(",")
}
/** 获取博物馆列表 */
const museumList = ref<any[]>([])
const museumChosen = ref<number>()
const getMuseumList = () => {
  loading.value = true
  getMuseumListApi({
    current: 1,
    size: 9999,
    name: undefined,
    createTime: undefined,
    updateTime: undefined
  })
    .then((res: any) => {
      museumList.value = res.data.data.data
    })
    .catch(() => {
      museumList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
/** 根据Id获取博物馆信息 */
const getMuseumName = (row: any) => {
  getMuseInfoById(row.institutionId).then((res: any) => {
    row.institution = res.data.data.name
  })
  // console.log(row.institution)
  return row.institution
}

const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  nickname: "",
  order: "",
  createTime: [],
  updateTime: []
})
/** 获取用户列表 */
const userList = ref<any[]>([]) //用户列表
const getUserList = () => {
  loading.value = true
  getUserListApi({
    current: paginationData.currentPage,
    size: paginationData.pageSize,
    nickname: searchData.nickname || undefined,
    createTime: searchData.createTime || undefined,
    updateTime: searchData.updateTime || undefined,
    order: searchData.order || undefined
  })
    .then((res: any) => {
      paginationData.total = res.data.data.total
      userList.value = res.data.data.data
      // console.log(userList.value)
    })
    .catch(() => {
      userList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getUserList()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getUserList()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getUserList()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getUserList, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" class="search-wrapper" shadow="never">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="searchData.nickname" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="searchData.createTime[0]" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="更新时间" prop="updateTime">
          <el-input v-model="searchData.updateTime[0]" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button :icon="CirclePlus" type="primary" @click="handleOpenAdd">新增用户</el-button>
          <!-- <el-button type="danger" :icon="Delete">批量删除</el-button> -->
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button :icon="Download" circle type="primary" />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button :icon="RefreshRight" circle type="primary" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="userList">
          <el-table-column align="center" type="selection" width="50" />
          <el-table-column align="center" label="id" prop="id" sortable />
          <el-table-column align="center" label="用户名" prop="username" />
          <el-table-column align="center" label="昵称" prop="nickname" />
          <el-table-column key="roles" :formatter="rolesData" align="center" label="身份" prop="roles">
            <!-- <template #default="scope">
              <el-tag v-if="scope.row.roles.name === 'sys_admin'" effect="plain">sys_admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles.name }}</el-tag>
            </template> -->
          </el-table-column>
          <el-table-column align="center" label="博物馆" prop="institutionId">
            <template #default="scope">
              <el-tag v-if="scope.row.institutionId === null" effect="plain" type="danger">暂无</el-tag>
              <!-- <el-tag v-else type="success" effect="plain" @click="getMuseumName(scope.row)">{{
                scope.row.institution === undefined ? "查看" : scope.row.institution
              }}</el-tag> -->
              <el-tag v-else effect="plain" type="success">{{ getMuseumName(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号" prop="phone" />
          <el-table-column align="center" label="邮箱" prop="email" />
          <el-table-column align="center" label="状态" prop="enabled" sortable>
            <template #default="scope">
              <el-tag v-if="scope.row.enabled" effect="plain" type="success">启用</el-tag>
              <el-tag v-else effect="plain" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column key="roles" :formatter="rolesData2" align="center" label="创建时间" prop="roles" sortable />
          <el-table-column align="center" fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button bg size="small" text type="primary" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button bg size="small" text type="primary" @click="openReset(scope.row)">重置密码</el-button>
              <el-button bg size="small" text type="danger" @click="handleChange(scope.row)">切换状态</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          :currentPage="paginationData.currentPage"
          :layout="paginationData.layout"
          :page-size="paginationData.pageSize"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/修改 组件 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      width="30%"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item v-if="currentUpdateId === undefined" label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" show-password type="password" />
        </el-form-item>
        <el-form-item label="身份" prop="role">
          <el-select v-model="roleChosen" multiple placeholder="请选择身份">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属博物馆" prop="institution">
          <el-select v-model="museumChosen" placeholder="请选择博物馆">
            <el-option v-for="item in museumList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入电话" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码组件 -->
    <el-dialog v-model="resetPwdFormVisible" :close-on-click-modal="false" center title="重置密码">
      <el-form ref="resetPwdFormRef" :model="resetPwdForm" :rules="resetPwdFormRules" label-width="80px">
        <el-row align="middle" justify="center" type="flex">
          <el-form-item label="新密码" prop="password">
            <el-input v-model="resetPwdForm.password" auto-complete="off" show-password type="password" />
          </el-form-item>
        </el-row>
        <el-row align="middle" justify="center" type="flex">
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input v-model="resetPwdForm.confirmpassword" auto-complete="off" show-password type="password" />
          </el-form-item>
        </el-row>
        <el-row align="middle" justify="center" type="flex">
          <el-button @click="resetPwdFormVisible = false">取消</el-button>
          <el-button :loading="editLoading" type="primary" @click="handleResetPwd">确认重置</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
