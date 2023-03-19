<script lang="ts" setup>
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus"
import { reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { getMuseumListApi, uploadFile } from "@/api/adminMuseum"
import { getCreativeListApi, addCreativeApi, updateCreativeApi } from "@/api/creative"
import { Plus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
// import { PageFooter } from "@/layout/components"

const router = useRouter()
const userStore = useUserStoreHook()
//分页
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const loading = ref<boolean>(false)

/** 若为系统管理员，先选择博物馆 */
const choseMuseumDialogVisible = ref(true)
const createData = () => {
  loading.value = true
  // console.log(museumChosen.value, !Number.isNaN(museumChosen.value))
  userStore.getInfo()
  if (userStore.museumID !== null || museumChosen.value !== undefined) {
    loading.value = false
    choseMuseumDialogVisible.value = false
    getCreativeList()
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
    getCreativeList()
  } else {
    ElMessage.warning("还未选择博物馆！")
  }
}

/** 获取指定博物馆的文创列表 */
const creativeList = ref<any[]>([])
const getCreativeList = () => {
  loading.value = true
  getCreativeListApi({
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
      creativeList.value = res.data.data.data
      // console.log(res.data)
    })
    .catch(() => {
      creativeList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

/** 添加/修改文创 */
/** 上传image相关 */
const file = ref<any>()
const fileUrl = ref("")
const fileList = ref<any[]>([])
const imageUrl = ref("")
const imageList = ref<any[]>([])
const beforeUpload = (_file: any) => {
  fileUrl.value = URL.createObjectURL(_file)
  return false
}
const handlePictureExceed = (_files: any, _fileList: any) => {
  ElMessage.warning("很抱歉,最多上传5张图片")
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
    // file.value = _file.raw
    fileList.value.push(_file.raw)
    // console.log(fileList.value)
    //fileList.value = _fileList
  }
}

const handlePictureRemove = (_file: any, _fileList: any) => {
  _fileList.forEach(function (item: any) {
    if (item === _file) {
      _fileList.splice(_fileList.indexOf(item), 1)
    }
  })
}
const previewPicDialog = ref(false)
const previewImage = ref("")
const handlePictureCardPreview = (_file: any) => {
  previewImage.value = _file.url
  previewPicDialog.value = true
}
const resetForm = () => {
  currentUpdateId.value = undefined
  creativeForm.name = ""
  creativeForm.description = ""
  creativeForm.imageList = []
  // file.value = undefined
  fileList.value = []
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// const handleUpload = () => {
//   return new Promise((resolve, reject) => {
//     // console.log(fileList.value)
//     if (fileList.value.length === 0) {
//       imageList.value = creativeForm.imageList
//       resolve(true)
//     } else {
//       fileList.value.forEach(function (item, index) {
//         if (item.url !== undefined) {
//           imageList.value.push(item.url)
//         } else {
//           const param = new FormData()
//           param.append("file", item)
//           // console.log(fileList.value)
//           uploadFile(param)
//             .then((res) => {
//               imageList.value.push(res.data.data)
//               // console.log(res)
//               resolve(index)
//             })
//             .catch((error) => {
//               reject(error)
//             })
//         }
//       })
//     }
//     console.log("upload函数最后的imageList:")
//     console.log(imageList.value)
//   })
// }

const handleUpload = () => {
  // console.log(fileList.value)
  const p1 = Promise.resolve(true)
  const pList = ref<any[]>([])
  pList.value[0] = p1
  if (fileList.value.length === 0) {
    return new Promise((resolve, reject) => {
      imageList.value = creativeForm.imageList
      resolve(true)
    })
  } else {
    fileList.value.forEach(function (item, index) {
      // await Promise.all(pList.value.slice(0, index + 1))
      pList.value[index + 1] = new Promise((resolve, reject) => {
        if (item.url !== undefined) {
          imageList.value.push(item.url)
          resolve(true)
        } else {
          const param = new FormData()
          param.append("file", item)
          // console.log(fileList.value)
          uploadFile(param)
            .then((res) => {
              imageList.value.push(res.data.data)
              // console.log(res)
              resolve(index)
            })
            .catch((error) => {
              reject(error)
            })
        }
      })
    })
    return Promise.all(pList.value)
    //promise.all方法用于将多个promise实例，包装成一个新的promise实例
  }
}

const handleUpdate = async () => {
  await handleUpload()
  // console.log(imageList.value)
  updateCreativeApi({
    id: currentUpdateId.value as number,
    name: creativeForm.name,
    museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
    description: creativeForm.description,
    imageList: imageList.value,
    deleted: false
  }).then(() => {
    // console.log(res)
    ElMessage.success("修改成功")
    dialogVisible.value = false
    getCreativeList()
    imageList.value = []
  })
}

/** 新增/修改会话弹窗 */
const dialogVisible = ref(false)
const creativeFormRef = ref<FormInstance | null>(null)
const creativeForm = reactive({
  name: "",
  description: "",
  imageList: [] as any[]
})
const creativeFormRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入文创名" }],
  description: [{ required: true, trigger: "blur", message: "请输入文创描述" }]
})
const handleOpenAddCreative = () => {
  if (userStore.museumID === null && museumChosen.value === undefined) {
    ElMessage.warning("请先选择一个博物馆")
  } else {
    dialogVisible.value = true
    fileList.value = []
  }
}

const handleAdd = async () => {
  // 无图新增时
  // console.log("处理新增时： " + fileList.value)
  if (fileList.value.length === 0) {
    addCreativeApi({
      name: creativeForm.name,
      description: creativeForm.description,
      museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
      imageList: [],
      deleted: false
    }).then(() => {
      ElMessage.success("新增成功")
      dialogVisible.value = false
      getCreativeList()
      imageList.value = []
    })
  } else {
    // 有图新增时
    await handleUpload()
    // console.log("上传图片后的imageList: ")
    // console.log(imageList.value)
    creativeForm.imageList = imageList.value

    addCreativeApi({
      name: creativeForm.name,
      description: creativeForm.description,
      museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
      imageList: imageList.value,
      deleted: false
    }).then(() => {
      ElMessage.success("新增成功")
      dialogVisible.value = false
      getCreativeList()
      imageList.value = []
    })
  }
}

const handleCreate = () => {
  creativeFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        handleAdd()
      } else {
        handleUpdate()
      }
    } else {
      return false
    }
  })
}

/** 打开修改文创弹窗 一些props */
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdateOpen = (item: any) => {
  fileList.value = []
  currentUpdateId.value = item.id
  creativeForm.name = item.name
  creativeForm.description = item.description
  creativeForm.imageList = item.imageList
  // console.log(item.imageList)

  fileList.value = item.imageList.map((i: any) => {
    return {
      url: i
    }
  })
  dialogVisible.value = true
}

/** 修改文创启用状态 */
const currentStates = ref<string>("")
const targetStates = ref<string>("")
const handleChange = (item: any) => {
  currentStates.value = item.deleted === true ? "已删除" : "使用中"
  targetStates.value = item.deleted === false ? "已删除" : "使用中"
  const data = [
    `当前文创: ${item.name}`,
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
    updateCreativeApi({
      id: item.id,
      name: item.name,
      museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
      description: item.description,
      imageList: item.imageList,
      deleted: !item.deleted
    }).then(() => {
      ElMessage.success("状态切换成功")
      getCreativeList()
    })
  })
}

/** 查看文创详情 */
const detailDialogVisible = ref(false)
const imageDetail = ref("")
const imageListDetail = ref<any[]>([])
const nameDetail = ref("")
const descriptionDetail = ref("")
const enabledDetail = ref(false)
const handleDetails = (item: any) => {
  detailDialogVisible.value = true
  // imageDetail.value = item.imageUrl
  imageListDetail.value = item.imageList
  // console.log("详情页的iamgeList: " + imageListDetail.value)
  nameDetail.value = item.name
  descriptionDetail.value = item.description
  enabledDetail.value = item.deleted
}

createData()

watch([() => paginationData.currentPage, () => paginationData.pageSize], getCreativeList)
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
        style="margin-right: 8%"
        @click="handleChoseMuseumAgain"
        >选择博物馆</el-button
      >
    </el-row>

    <el-row>
      <el-col v-for="(item, index) in creativeList" :key="item.id" :span="6" :offset="index % 3 === 0 ? 2 : 1">
        <el-card style="margin-bottom: 10px" :body-style="{ padding: '0px' }" shadow="hover">
          <div class="image-block">
            <el-image v-if="item.imageList.length !== 0" :src="item.imageList[0]" class="image" fit="contain" />
            <el-empty v-else :image-size="35" description="暂未上传" />
          </div>
          <div style="padding: 14px">
            <span>{{ item.name }}</span>
            <span style="margin-left: 15px">
              <el-tag v-if="!item.deleted" type="success" effect="plain">使用中</el-tag>
              <el-tag v-else type="danger" effect="plain">已删除</el-tag>
            </span>
            <div class="bottom" style="margin-top: 15px">
              <el-button class="button" @click="handleDetails(item)">查看</el-button>
              <el-button class="button" @click="handleUpdateOpen(item)">修改</el-button>
              <el-button class="button" @click="handleChange(item)">切换状态</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :offset="creativeList.length % 3 === 0 ? 2 : 1">
        <el-card class="add-icon-container" :body-style="{ padding: '0px' }" shadow="never">
          <!-- <el-icon @click="handleOpenAddCreative"><Plus /></el-icon> -->
          <el-button text :icon="Plus" @click="handleOpenAddCreative" />
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
    <el-dialog v-model="previewPicDialog" @close="previewPicDialog = false" width="50%">
      <el-image :src="previewImage" style="margin: auto; display: block" />
    </el-dialog>
    <!-- 新增/修改 组件 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增文创' : '修改文创信息'"
      @close="resetForm"
      width="50%"
    >
      <el-form
        ref="creativeFormRef"
        :model="creativeForm"
        :rules="creativeFormRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item prop="name" label="文创名称">
          <el-input v-model="creativeForm.name" placeholder="请输入文创名称" />
        </el-form-item>
        <el-form-item prop="description" label="文创描述">
          <el-input type="textarea" v-model="creativeForm.description" placeholder="请输入文创描述" />
        </el-form-item>
        <el-form-item prop="imageList" label="上传文创图片">
          <el-upload
            class="uploader"
            action="#"
            ref="upload"
            :limit="5"
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

    <!-- 文创详情 组件 -->
    <el-dialog v-model="detailDialogVisible" :title="nameDetail" @close="detailDialogVisible = false">
      <div class="imageCarousel">
        <el-carousel trigger="click">
          <el-carousel-item v-for="item in imageListDetail" :key="item">
            <el-image
              v-if="imageListDetail.length !== 0"
              :src="item"
              fit="contain"
              class="justify-center"
              style="width: 100%"
            />
            <el-empty v-else :image-size="35" description="暂未上传" />
          </el-carousel-item>
          <!-- <el-image v-if="imageDetail !== ''" :src="imageDetail" fit="contain" />
          <el-empty v-else :image-size="35" description="暂未上传" /> -->
        </el-carousel>
      </div>
      <el-descriptions style="margin-top: 20px" :column="1" border>
        <el-descriptions-item label="文创描述: ">{{ descriptionDetail }}</el-descriptions-item>
        <el-descriptions-item label="状态: ">{{ enabledDetail === true ? "已删除" : "使用中" }}</el-descriptions-item>
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
