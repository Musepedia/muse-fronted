<script lang="ts" setup>
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus"
import { reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { getMuseumListApi, uploadFile } from "@/api/adminMuseum"
import { getZoneListApi, addZoneApi, updateZoneApi, changeZoneEnableApi } from "@/api/MuseumZone"
import { Plus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
// import { PageFooter } from "@/layout/components"

const router = useRouter()
const userStore = useUserStoreHook()
//分页
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const loading = ref<boolean>(false)
const handleEditZonePosition = () => {
  router.push({ path: "/menu/zonePosition" })
}

/** 若为系统管理员，先选择博物馆 */
const choseMuseumDialogVisible = ref(true)
const createData = () => {
  loading.value = true
  // console.log(museumChosen.value, !Number.isNaN(museumChosen.value))
  userStore.getInfo()
  if (userStore.museumID !== null || museumChosen.value !== undefined) {
    loading.value = false
    choseMuseumDialogVisible.value = false
    getZoneList()
  } else if (userStore.roles[0] !== "sys_admin") {
    ElMessage.warning("暂未绑定博物馆,请先绑定")
    router.push({ path: "/dashboard" })
  } else {
    //系统管理员需选择博物馆
    getMuseumList()
    loading.value = false
  }
}

/** 系统管理员可以再次重新选择博物馆 */
const handleChoseMuseumAgain = () => {
  loading.value = true
  choseMuseumDialogVisible.value = true
  getMuseumList()
  loading.value = false
}

/** 获取博物馆列表 */
const museumList = ref<any[]>([])
const museumChosen = ref<number>()
museumChosen.value = Number.isNaN(parseInt(window.sessionStorage.getItem("museumChosen") as string))
  ? undefined
  : parseInt(window.sessionStorage.getItem("museumChosen") as string)
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

const handleChoseMuseumClose = () => {
  if (userStore.museumID === null && museumChosen.value === undefined) {
    ElMessage.warning("请先选择一个博物馆")
  } else {
    choseMuseumDialogVisible.value = false
  }
}

const handleChoseMuseum = () => {
  if (museumChosen.value !== undefined) {
    // if (Number.isNaN(museumChosen.value)) {
    choseMuseumDialogVisible.value = false
    // userStore.museumID = museumChosen.value
    window.sessionStorage.setItem("museumChosen", (museumChosen.value as number).toString())
    getZoneList()
  } else {
    ElMessage.warning("还未选择博物馆！")
  }
}

/** 获取指定博物馆的展区列表 */
const zoneList = ref<any[]>([])
const getZoneList = () => {
  loading.value = true
  getZoneListApi({
    current: paginationData.currentPage,
    size: paginationData.pageSize,
    museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
    name: undefined,
    createTime: undefined,
    updateTime: undefined,
    order: undefined
  })
    .then((res: any) => {
      paginationData.total = res.data.data.total
      zoneList.value = res.data.data.data
    })
    .catch(() => {
      zoneList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

/** 添加/修改展区 */
/** 上传image相关 */
const file = ref<any>()
const fileUrl = ref("")
const fileList = ref<any[]>([])
const imageUrl = ref("")
const beforeUpload = (_file: any) => {
  fileUrl.value = URL.createObjectURL(_file)
  return false
}
const handlePictureExceed = (_files: any, _fileList: any) => {
  ElMessage.warning("很抱歉,只能上传1张图片")
}
const handlePictureChange = (_file: any, _fileList: any) => {
  if (_file) {
    const extension = _file.name.substring(_file.name.lastIndexOf(".") + 1)
    const size = _file.size / 1024 / 1024
    if (extension !== "jpg" && extension !== "png" && extension !== "jpeg") {
      ElMessage.warning("请上传后缀名为.jpg或.jpeg或.png的图片")
    }
    if (size > 20) {
      ElMessage.warning("文件大小请不要超过20MB")
    }
    file.value = _file.raw
    //fileList.value = _fileList
    // console.log(fileList.value)
  }
}
const handlePictureRemove = (_file: any, _fileList: any) => {
  _fileList.value = []
}
const previewPicDialog = ref(false)
const previewImage = ref("")
const handlePictureCardPreview = (_file: any) => {
  previewImage.value = _file.url
  previewPicDialog.value = true
}
const resetForm = () => {
  currentUpdateId.value = undefined
  zoneForm.name = ""
  zoneForm.description = ""
  zoneForm.imageUrl = ""
  file.value = undefined
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

const handleUpload = () => {
  return new Promise((resolve, reject) => {
    // console.log(file.value)
    if (file.value === undefined) {
      imageUrl.value = zoneForm.imageUrl
      resolve(true)
    } else {
      const param = new FormData()
      param.append("file", file.value)
      // console.log(fileList.value)
      uploadFile(param)
        .then((res) => {
          imageUrl.value = res.data.data
          // console.log(res)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    }
  })
}
const handleUpdate = async () => {
  await handleUpload()
  updateZoneApi({
    id: currentUpdateId.value as number,
    name: zoneForm.name,
    museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
    description: zoneForm.description,
    imageUrl: imageUrl.value
  }).then(() => {
    // console.log(res)
    ElMessage.success("修改成功")
    dialogVisible.value = false
    getZoneList()
  })
}

/** 新增/修改会话弹窗 */
const dialogVisible = ref(false)
const zoneFormRef = ref<FormInstance | null>(null)
const zoneForm = reactive({
  name: "",
  description: "",
  imageUrl: ""
})
const zoneFormRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入展区名" }],
  description: [{ required: true, trigger: "blur", message: "请输入展区描述" }]
})
const handleOpenAddZone = () => {
  if (userStore.museumID === null && museumChosen.value === undefined) {
    ElMessage.warning("请先选择一个博物馆")
  } else {
    dialogVisible.value = true
  }
}

const handleCreate = () => {
  zoneFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        const param = new FormData()
        param.append("file", file.value)
        uploadFile(param).then((res) => {
          imageUrl.value = res.data.data
          zoneForm.imageUrl = res.data.data

          addZoneApi({
            name: zoneForm.name,
            description: zoneForm.description,
            museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
            imageUrl: imageUrl.value
          }).then(() => {
            ElMessage.success("新增成功")
            dialogVisible.value = false
            getZoneList()
          })
        })
      } else {
        handleUpdate()
      }
    } else {
      return false
    }
  })
}

/** 打开修改展区弹窗 一些props */
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdateOpen = (item: any) => {
  fileList.value = []
  currentUpdateId.value = item.id
  zoneForm.name = item.name
  zoneForm.description = item.description
  zoneForm.imageUrl = item.imageUrl

  fileList.value.push({ url: item.imageUrl as string })
  dialogVisible.value = true
}

/** 修改展区启用状态 */
const currentStates = ref<string>("")
const targetStates = ref<string>("")
const handleChange = (item: any) => {
  currentStates.value = item.enabled === true ? "启用" : "关闭"
  targetStates.value = item.enabled === false ? "启用" : "关闭"
  const data = [
    `当前展区: ${item.name}`,
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
    changeZoneEnableApi({
      enable: !item.enabled,
      id: item.id
    }).then(() => {
      ElMessage.success("状态切换成功")
      getZoneList()
    })
  })
}

/** 查看展区详情 */
const detailDialogVisible = ref(false)
const imageDetail = ref("")
const nameDetail = ref("")
const descriptionDetail = ref("")
const enabledDetail = ref(false)
const handleDetails = (item: any) => {
  detailDialogVisible.value = true
  imageDetail.value = item.imageUrl
  nameDetail.value = item.name
  descriptionDetail.value = item.description
  enabledDetail.value = item.enabled
}

createData()

watch([() => paginationData.currentPage, () => paginationData.pageSize], getZoneList)
</script>

<template>
  <div class="app-container">
    <el-dialog
      v-model="choseMuseumDialogVisible"
      title="请选择一个博物馆"
      width="30%"
      style="display: block"
      :before-close="handleChoseMuseumClose"
      loading="loading"
    >
      <el-select style="margin: auto" v-model="museumChosen" placeholder="请选择博物馆">
        <el-option v-for="item in museumList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <template #footer>
        <span class="chose-footer">
          <el-button @click="handleChoseMuseum">确认选择</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="search-wrapper">
      <el-button
        v-if="userStore.roles[0] === 'sys_admin'"
        type="info"
        plain
        style="margin-right: 5px"
        @click="handleChoseMuseumAgain"
        >选择博物馆</el-button
      >
      <el-button type="info" plain style="margin-right: 8%" @click="handleEditZonePosition">编辑展区位置</el-button>
    </el-row>

    <el-row>
      <!-- <el-empty v-if="zoneList.length === 0" class="logo" description="暂无展区数据" style="margin: auto" /> -->
      <el-col v-for="(item, index) in zoneList" :key="item.id" :span="6" :offset="index % 3 === 0 ? 2 : 1">
        <el-card style="margin-bottom: 10px" :body-style="{ padding: '0px' }" shadow="hover">
          <div class="image-block">
            <el-image v-if="item.imageUrl !== ''" :src="item.imageUrl" class="image" fit="contain" />
            <el-empty v-else :image-size="35" description="暂未上传" />
          </div>
          <div style="padding: 14px">
            <span>{{ item.name }}</span>
            <span style="margin-left: 15px">
              <el-tag v-if="item.enabled" type="success" effect="plain">启用中</el-tag>
              <el-tag v-else type="danger" effect="plain">已关闭</el-tag>
            </span>
            <div class="bottom" style="margin-top: 15px">
              <el-button class="button" @click="handleDetails(item)">查看</el-button>
              <el-button class="button" @click="handleUpdateOpen(item)">修改</el-button>
              <el-button class="button" @click="handleChange(item)">切换状态</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :offset="zoneList.length % 3 === 0 ? 2 : 1">
        <el-card class="add-icon-container" :body-style="{ padding: '0px' }" shadow="never">
          <!-- <el-icon @click="handleOpenAddZone"><Plus /></el-icon> -->
          <el-button text :icon="Plus" @click="handleOpenAddZone" />
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <div class="pager-wrapper">
      <el-pagination
        background
        :layout="paginationData.layout"
        :page-sizes="paginationData.pageSizes"
        :total="paginationData.total"
        :page-size="paginationData.pageSize"
        :currentPage="paginationData.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- <PageFooter /> -->

    <!-- 图片预览 组件 -->
    <el-dialog v-model="previewPicDialog" @close="previewPicDialog = false" style="display: block" width="50%">
      <el-image :src="previewImage" style="margin: auto" />
    </el-dialog>
    <!-- 新增/修改 组件 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增展区' : '修改展区信息'"
      @close="resetForm"
      width="50%"
    >
      <el-form ref="zoneFormRef" :model="zoneForm" :rules="zoneFormRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="展区名称">
          <el-input v-model="zoneForm.name" placeholder="请输入展区名称" />
        </el-form-item>
        <el-form-item prop="description" label="展区描述">
          <el-input type="textarea" v-model="zoneForm.description" placeholder="请输入展区描述" />
        </el-form-item>
        <el-form-item prop="imageUrl" label="上传展区图片">
          <el-upload
            class="uploader"
            action="#"
            ref="upload"
            :limit="1"
            :file-list="fileList"
            list-type="picture-card"
            accept=".jpg,.png,.jpeg,.JPG,.JPEG"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-exceed="handlePictureExceed"
            :on-preview="handlePictureCardPreview"
            :on-change="handlePictureChange"
            :on-remove="handlePictureRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
    <!-- 展区详情 组件 -->
    <el-dialog v-model="detailDialogVisible" :title="nameDetail" @close="detailDialogVisible = false">
      <div class="imageCarousel">
        <el-carousel trigger="click" height="100%">
          <!-- <el-carousel-item v-for="item in imageList" :key="item">
            <el-image :src="item.imageUrl" fit="contain" />
          </el-carousel-item> -->
          <el-image v-if="imageDetail !== ''" :src="imageDetail" fit="contain" />
          <el-empty v-else :image-size="35" description="暂未上传" />
        </el-carousel>
      </div>
      <el-descriptions style="margin-top: 20px" :column="1" border>
        <el-descriptions-item label="展区描述: ">{{ descriptionDetail }}</el-descriptions-item>
        <el-descriptions-item label="状态: ">{{ enabledDetail === true ? "启用中" : "已关闭" }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  justify-content: flex-end;
  :deep(.el-button.is-plain) {
    --el-button-text-color: #292929;
    --el-button-border-color: #1f1f1f;
    --el-button-hover-text-color: #f5f3f3;
  }
}

:deep(.el-card) {
  border-radius: 10px;
  background-color: #fafafa;
}

.add-icon-container {
  margin-bottom: 10px;
  height: 300px;
  display: flex;
  justify-content: center;
  :deep(.el-card__body) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.image-block {
  // padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: flex;
  width: 100%;
  height: 230px;
  box-sizing: border-box;
  justify-content: center;
  vertical-align: middle;
}

.button {
  margin-left: 0;
  margin-right: 3px;
  padding: 8px 10px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
