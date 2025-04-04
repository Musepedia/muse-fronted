<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from "vue"
import { useUserStoreHook } from "@/store/modules/user"
import { getZoneListApi } from "@/api/MuseumZone"
import { useRouter } from "vue-router"
import {
  addExhibitApi,
  changeExhibitEnableApi,
  getExhibitAliasApi,
  getExhibitListApi,
  getExhibitTextApi,
  updateExhibitAliasApi,
  updateExhibitApi,
  updateExhibitTextApi
} from "@/api/MuseumExhibit"
import { getMuseumListApi, uploadFile } from "@/api/adminMuseum"
import { ElInput, ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
// import { PageFooter } from "@/layout/components"

const router = useRouter()
const userStore = useUserStoreHook()
//分页
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

/** 通用加载 */
const loading = ref(false)
/** 编辑展品位置 跳转 */
const handleEditExhibitPosition = () => {
  router.push({ path: "/menu/exhibitPosition" })
}

/** 加载数据 */
/** 若为系统管理员，先选择博物馆 */
const choseMuseumDialogVisible = ref(true)
const createData = () => {
  loading.value = true
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
    .then((res) => {
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

const handleChoseMuseum = async () => {
  if (museumChosen.value !== undefined) {
    choseMuseumDialogVisible.value = false
    // userStore.museumID = museumChosen.value
    window.sessionStorage.setItem("museumChosen", (museumChosen.value as number).toString())
    await getZoneList()
    zoneChosen.value = undefined
    exhibitList.value = []
  } else {
    ElMessage.warning("还未选择博物馆！")
  }
}

/** 获取指定博物馆的展区列表 */
const zoneList = ref<any[]>([])
const getZoneList = () => {
  return new Promise((resolve, reject) => {
    loading.value = true
    getZoneListApi({
      current: 1,
      size: 9999,
      museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
      name: undefined,
      createTime: undefined,
      updateTime: undefined,
      order: undefined
    })
      .then((res: any) => {
        zoneList.value = res.data.data.data
        resolve(res)
      })
      .catch((error) => {
        zoneList.value = []
        reject(error)
      })
      .finally(() => {
        loading.value = false
      })
  })
}

/** 系统管理员可以再次重新选择博物馆 */
const handleChoseMuseumAgain = () => {
  loading.value = true
  choseMuseumDialogVisible.value = true
  getMuseumList()
  // zoneChosen.value = undefined
  // exhibitList.value = []
  // getExhibitList()
  loading.value = false
}

/** 选定展区 获取展区下所有展品 */
const zoneChosen = ref<number>()
const exhibitList = ref<any[]>([])
const getExhibitList = () => {
  loading.value = true
  if (zoneChosen.value !== undefined) {
    getExhibitListApi({
      current: paginationData.currentPage,
      size: paginationData.pageSize,
      museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
      exhibitionHallId: zoneChosen.value
    })
      .then((res) => {
        paginationData.total = res.data.data.total
        exhibitList.value = res.data.data.data
      })
      .catch(() => {
        exhibitList.value = []
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    loading.value = false
  }
}

/**
 * 添加/修改展品
 * */
/** 上传image相关 */
const file = ref<any>()
const fileUrl = ref("")
const fileList = ref<any[]>([])
const figureUrl = ref("")
const figureUrlList = ref<any[]>([])
const beforeUpload = (_file: any) => {
  fileUrl.value = URL.createObjectURL(_file)
  return false
}
/** 图片超过限制数量时 */
const handlePictureExceed = (_files: any, _fileList: any) => {
  ElMessage.warning("很抱歉,只能上传5张图片")
}
/** 更换已选择图片时 */
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
    //fileList.value = _fileList
    // console.log(fileList.value)
  }
}
/** 删除已选择的图片时 */
const handlePictureRemove = (_file: any, _fileList: any) => {
  _fileList.forEach(function (item: any) {
    if (item === _file) {
      _fileList.splice(_fileList.indexOf(item), 1)
    }
  })
  fileList.value = _fileList
  exhibitForm.figureUrlList = _fileList
}

/** 处理图片放大预览 */
const previewPicDialog = ref(false)
const previewImage = ref("")
const handlePictureCardPreview = (_file: any) => {
  previewImage.value = _file.url
  previewPicDialog.value = true
}
/** 关闭新增/修改窗口后的表单重置操作 */
const resetForm = () => {
  currentUpdateId.value = undefined
  exhibitForm.label = ""
  exhibitForm.description = ""
  exhibitForm.figureUrl = ""
  exhibitForm.figureUrlList = []
  // file.value = undefined
  fileList.value = []
}
/** 关闭新增/修改窗口的操作 */
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}
/** 处理"修改"时的文件上传，要判断修改的是文件还是其他属性 */
// const handleUpload = () => {
//   return new Promise((resolve, reject) => {
//     // console.log(file.value)
//     if (file.value === undefined) {
//       figureUrl.value = exhibitForm.figureUrl
//       resolve(true)
//     } else {
//       const param = new FormData()
//       param.append("file", file.value)
//       // console.log(fileList.value)
//       uploadFile(param)
//         .then((res) => {
//           figureUrl.value = res.data.data
//           // console.log(res)
//           resolve(true)
//         })
//         .catch((error) => {
//           reject(error)
//         })
//     }
//   })
// }

const handleUpload = () => {
  // console.log(fileList.value)
  const p1 = Promise.resolve(true)
  const pList = ref<any[]>([])
  pList.value[0] = p1
  if (fileList.value.length === 0) {
    return new Promise((resolve, reject) => {
      figureUrlList.value = exhibitForm.figureUrlList
      resolve(true)
    })
  } else {
    fileList.value.forEach(function (item, index) {
      // await Promise.all(pList.value.slice(0, index + 1))
      pList.value[index + 1] = new Promise((resolve, reject) => {
        if (item.url !== undefined) {
          figureUrlList.value.push(item.url)
          resolve(true)
        } else {
          const param = new FormData()
          param.append("file", item)
          // console.log(fileList.value)
          uploadFile(param)
            .then((res) => {
              figureUrlList.value.push(res.data.data)
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

/** 处理修改操作，若文件有更改，仍需先上传文件再更新 */
const handleUpdate = async () => {
  await handleUpload()
  updateExhibitApi({
    id: currentUpdateId.value as number,
    label: exhibitForm.label,
    hallId: zoneChosen.value as number,
    description: exhibitForm.description,
    figureUrl: figureUrl.value,
    figureUrlList: figureUrlList.value
  }).then(() => {
    // console.log(res)
    ElMessage.success("修改成功")
    dialogVisible.value = false
    getExhibitList()
    figureUrlList.value = []
  })
}

/** 新增/修改会话弹窗相关参数与函数 */
const dialogVisible = ref(false)
const exhibitFormRef = ref<FormInstance | null>(null)
const exhibitForm = reactive({
  label: "",
  description: "",
  figureUrl: "",
  figureUrlList: [] as any[],
  nextId: 0,
  prevId: 0
})
const exhibitFormRules: FormRules = reactive({
  label: [{ required: true, trigger: "blur", message: "请输入展品名" }],
  description: [{ required: true, trigger: "blur", message: "请输入展品描述" }]
})
const handleOpenAddExhibit = () => {
  if (zoneChosen.value === undefined) {
    ElMessage.warning("请先选择一个展区")
  } else {
    dialogVisible.value = true
    fileList.value = []
  }
}

/** 打开修改展区弹窗 一些props */
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdateOpen = (item: any) => {
  fileList.value = []
  currentUpdateId.value = item.id
  exhibitForm.label = item.label
  exhibitForm.description = item.description
  exhibitForm.figureUrl = item.figureUrl
  exhibitForm.figureUrlList = item.figureUrlList

  fileList.value = item.figureUrlList.map((i: any) => {
    return {
      url: i
    }
  })
  dialogVisible.value = true
}

const handleAdd = async () => {
  // 无图新增时
  // console.log("处理新增时： " + fileList.value)
  if (fileList.value.length === 0) {
    addExhibitApi({
      label: exhibitForm.label,
      description: exhibitForm.description,
      hallId: zoneChosen.value as number,
      figureUrl: "",
      figureUrlList: []
    }).then(() => {
      ElMessage.success("新增成功")
      dialogVisible.value = false
      getExhibitList()
      figureUrlList.value = []
    })
  } else {
    // 有图新增时
    await handleUpload()
    // console.log("上传图片后的imageList: ")
    // console.log(figureUrlList.value)
    exhibitForm.figureUrlList = figureUrlList.value

    addExhibitApi({
      label: exhibitForm.label,
      description: exhibitForm.description,
      hallId: zoneChosen.value as number,
      figureUrlList: figureUrlList.value,
      figureUrl: figureUrlList.value[0]
    }).then(() => {
      ElMessage.success("新增成功")
      dialogVisible.value = false
      getExhibitList()
      figureUrlList.value = []
    })
  }
}

/** 新增/修改展品接口 */
const handleCreate = () => {
  exhibitFormRef.value?.validate((valid: boolean) => {
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

/** 修改展品启用状态 */
const currentStates = ref<string>("")
const targetStates = ref<string>("")
const handleChange = (item: any) => {
  currentStates.value = item.enabled === true ? "展览中" : "未陈列"
  targetStates.value = item.enabled === false ? "展览中" : "未陈列"
  const data = [
    `当前展品: ${item.label}`,
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
    changeExhibitEnableApi({
      enable: !item.enabled,
      id: item.id
    }).then(() => {
      ElMessage.success("状态切换成功")
      getExhibitList()
    })
  })
}

/** 查看展品详情 */
const currentDetailId = ref<number>() //当前查看的展品id
const detailDialogVisible = ref(false)
const figureDetail = ref("")
const figureUrlListDetail = ref<string[]>([])
const labelDetail = ref("")
const descriptionDetail = ref("")
const enabledDetail = ref(false)
const aliasDetail = ref<string[]>([]) //别名
const textDetail = ref<string[]>([]) //文本
const handleDetails = (item: any) => {
  detailDialogVisible.value = true
  figureDetail.value = item.figureUrl
  figureUrlListDetail.value = item.figureUrlList
  labelDetail.value = item.label
  descriptionDetail.value = item.description
  enabledDetail.value = item.enabled
  currentDetailId.value = item.id

  getExhibitAliasApi(item.id).then((res) => {
    aliasDetail.value = res.data.data

    getExhibitTextApi(item.id).then((res) => {
      textDetail.value = res.data.data
    })
  })
}

/** 更新展品别名 */
const inputValue = ref("")
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleCloseAlias = (alias: string) => {
  aliasDetail.value.splice(aliasDetail.value.indexOf(alias), 1)

  updateExhibitAliasApi({
    exhibitId: currentDetailId.value as number,
    exhibitAlias: aliasDetail.value
  }).then(() => {
    ElMessage.success("别名删除成功")
  })
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputAlias = () => {
  if (inputValue.value) {
    aliasDetail.value.push(inputValue.value)
  } else {
    inputVisible.value = false
    return false
  }

  updateExhibitAliasApi({
    exhibitId: currentDetailId.value as number,
    exhibitAlias: aliasDetail.value
  })
    .then((res) => {
      // console.log(res.data)
      ElMessage.success("别名新增成功")
    })
    .finally(() => {
      inputVisible.value = false
      inputValue.value = ""
      // console.log(aliasDetail.value)
    })
}
/** end */

/** 更新展品文本 */
const exhibitTextDialogVisible = ref(false)
const handleOpenEditText = () => {
  exhibitTextDialogVisible.value = true
}
const textValue = ref("")
const textVisible = ref(false)
const TextRef = ref<InstanceType<typeof ElInput>>()

const handleCloseText = (text: string) => {
  textDetail.value.splice(textDetail.value.indexOf(text), 1)
  // console.log(textDetail.value)

  updateExhibitTextApi({
    exhibitId: currentDetailId.value as number,
    exhibitText: textDetail.value
  }).then((res) => {
    // console.log(res.data)
    ElMessage.success("文本删除成功")
  })
}

const showText = () => {
  textVisible.value = true
  nextTick(() => {
    TextRef.value!.input!.focus()
  })
}

const handleInputText = () => {
  if (textValue.value) {
    textDetail.value.push(textValue.value)
  } else {
    textVisible.value = false
    return false
  }

  updateExhibitTextApi({
    exhibitId: currentDetailId.value as number,
    exhibitText: textDetail.value
  })
    .then((res) => {
      // console.log(res.data)
      ElMessage.success("文本新增成功")
    })
    .finally(() => {
      textVisible.value = false
      textValue.value = ""
      // console.log(textDetail.value)
    })
}

createData()

watch([zoneChosen, () => paginationData.currentPage, () => paginationData.pageSize], getExhibitList, {
  immediate: true
})
</script>

<template>
  <div class="app-container">
    <el-dialog
      v-model="choseMuseumDialogVisible"
      :before-close="handleChoseMuseumClose"
      loading="loading"
      style="display: block"
      title="请选择一个博物馆"
      width="30%"
    >
      <el-select v-model="museumChosen" placeholder="请选择博物馆" style="margin: auto">
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
        plain
        style="margin-right: 5px"
        type="info"
        @click="handleChoseMuseumAgain"
        >选择博物馆
      </el-button>
      <el-button plain style="margin-right: 8%" type="info" @click="handleEditExhibitPosition">编辑展品位置</el-button>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <span style="float: left; margin-left: 8%">展区筛选</span>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-select v-model="zoneChosen" placeholder="请选择展区" style="width: 84%; margin: auto">
        <el-option v-for="item in zoneList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-row>

    <!-- 展品陈列 -->
    <el-row>
      <!-- <el-empty v-if="zoneList.length === 0" class="logo" description="暂无展区数据" style="margin: auto" /> -->
      <el-col v-for="(item, index) in exhibitList" :key="item.id" :offset="index % 3 === 0 ? 2 : 1" :span="6">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" style="margin-bottom: 10px">
          <div class="image-block">
            <el-image v-if="item.figureUrl !== ''" :src="item.figureUrl" class="image" fit="contain" />
            <el-image
              v-else-if="item.figureUrlList.length !== 0 && item.figureUrlList[0] !== ''"
              :src="item.figureUrlList[0]"
              class="image"
              fit="contain"
            />
            <el-empty v-else :image-size="35" description="暂未上传" />
          </div>
          <div style="padding: 14px">
            <span>{{ item.label }}</span>
            <span style="margin-left: 15px">
              <el-tag v-if="item.enabled" effect="plain" type="success">展览中</el-tag>
              <el-tag v-else effect="plain" type="danger">未陈列</el-tag>
            </span>
            <div class="bottom" style="margin-top: 15px">
              <el-button class="button" @click="handleDetails(item)">查看</el-button>
              <el-button class="button" @click="handleUpdateOpen(item)">修改</el-button>
              <el-button class="button" @click="handleChange(item)">切换状态</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :offset="exhibitList.length % 3 === 0 ? 2 : 1" :span="6">
        <el-card :body-style="{ padding: '0px' }" class="add-icon-container" shadow="never">
          <!-- <el-icon @click="handleOpenAddZone"><Plus /></el-icon> -->
          <el-button :icon="Plus" text @click="handleOpenAddExhibit" />
        </el-card>
      </el-col>
    </el-row>
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

    <!-- 图片预览 组件 -->
    <el-dialog v-model="previewPicDialog" style="display: block" width="50%" @close="previewPicDialog = false">
      <el-image :src="previewImage" style="margin: auto" />
    </el-dialog>
    <!-- 新增/修改 组件 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增展品' : '修改展品信息'"
      width="50%"
      @close="resetForm"
    >
      <el-form
        ref="exhibitFormRef"
        :model="exhibitForm"
        :rules="exhibitFormRules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="展品名称" prop="label">
          <el-input v-model="exhibitForm.label" placeholder="请输入展品名称" />
        </el-form-item>
        <el-form-item label="展品描述" prop="description">
          <el-input v-model="exhibitForm.description" placeholder="请输入展品描述" type="textarea" />
        </el-form-item>
        <el-form-item label="上传展品图片" prop="figureUrlList">
          <el-upload
            ref="upload"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :limit="5"
            :on-change="handlePictureChange"
            :on-exceed="handlePictureExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handlePictureRemove"
            accept=".jpg,.png,.jpeg,.JPG,.JPEG"
            action="#"
            class="uploader"
            list-type="picture-card"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>

    <!-- 展品详情 组件 -->
    <el-dialog v-model="detailDialogVisible" :title="labelDetail" @close="detailDialogVisible = false">
      <div class="imageCarousel">
        <el-carousel class="imageCarousel-item" trigger="click">
          <el-carousel-item v-if="figureUrlListDetail.length === 0">
            <el-empty :image-size="35" description="暂未上传" />
          </el-carousel-item>
          <el-carousel-item v-for="item in figureUrlListDetail" v-else :key="item">
            <el-image
              v-if="figureUrlListDetail.length !== 0 && figureUrlListDetail[0] !== ''"
              :src="item"
              class="justify-center"
              fit="contain"
              style="width: 100%; height: 100%"
            />
            <el-empty v-else :image-size="35" description="暂未上传" />
          </el-carousel-item>
          <!-- <el-image v-if="figureDetail !== ''" :src="figureDetail" fit="scale-down" />
          <el-empty v-else :image-size="35" description="暂未上传" /> -->
        </el-carousel>
      </div>
      <el-descriptions :column="1" border style="margin-top: 20px">
        <el-descriptions-item label="别名: ">
          <el-tag
            v-for="alias in aliasDetail"
            :key="alias"
            :disable-transitions="false"
            class="mx-1"
            closable
            @close="handleCloseAlias(alias)"
          >
            {{ alias }}
          </el-tag>
          <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" @blur="handleInputAlias" />
          <el-button v-else class="ml-1" size="small" @click="showInput">+ New Alias</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="描述: ">{{ descriptionDetail }}</el-descriptions-item>
        <el-descriptions-item label="状态: ">{{ enabledDetail === true ? "展览中" : "未陈列" }}</el-descriptions-item>
        <el-descriptions-item label="文本: ">
          <el-button plain type="primary" @click="handleOpenEditText">更新展品文本</el-button>
          <!-- {{ textDetail }} -->
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 编辑展品文本 考虑到数据会很多 单独用dialog -->
    <el-dialog
      v-model="exhibitTextDialogVisible"
      :title="labelDetail"
      width="70%"
      @close="exhibitTextDialogVisible = false"
    >
      <el-tag
        v-for="text in textDetail"
        :key="text"
        :disable-transition="false"
        class="exhibit-text"
        closable
        @close="handleCloseText(text)"
      >
        {{ text }}
      </el-tag>
      <el-input
        v-if="textVisible"
        ref="TextRef"
        v-model="textValue"
        size="small"
        type="textarea"
        @blur="handleInputText"
      />
      <el-button v-else class="button-new-tag ml-1" size="small" @click="showText">+ New Text</el-button>
    </el-dialog>
    <!-- <PageFooter /> -->
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

.add-icon-container {
  margin-bottom: 10px;
  height: 330px;
  display: flex;
  justify-content: center;

  :deep(.el-card__body) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.imageCarousel-item {
  text-align: center;
  // border-right: solid 1px var(--el-border-color);
  display: flex;
  width: 100%;
  height: 460px;
  box-sizing: border-box;
  justify-content: center;
  vertical-align: middle;
  // :deep(.el-carousel__container) {
  //   height: 550px;
  // }
}

:deep(.el-carousel__container) {
  text-align: center;
  // border-right: solid 1px var(--el-border-color);
  display: flex;
  width: 100%;
  height: 460px;
  box-sizing: border-box;
  justify-content: center;
  vertical-align: middle;
}

:deep(.exhibit-text) {
  white-space: normal;
  height: auto;
  margin: 0.5rem;
}

:deep(.button-new-tag) {
  margin: 0.5rem;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
