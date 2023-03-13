<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  getMuseumListApi,
  getMuseInfoById,
  addMuseumApi,
  updateMuseumApi,
  changeMuseumServiceApi,
  uploadFile
} from "@/api/adminMuseum"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import loadBMap from "@/utils/loadMap"

/** 地图组件相关 */
const mapInit = loadBMap("FqQiSXzNuKB43VWUvMSuPBDbIYNfu5bN")

const longitude = ref("--")
const latitude = ref("--")
const address = ref("--")
const mapDialogVisible = ref(false)
const handleMapOpen = () => {
  mapDialogVisible.value = true
}

mapInit.then((BMap: any) => {
  // console.log(BMap)
  const map = new BMap.Map("map")
  map.centerAndZoom(new BMap.Point(121.4, 31.25), 8) //初始化地图，设置城市和地图级别
  map.enableScrollWheelZoom(true)

  const ac = new BMap.Autocomplete({ input: "suggestId", location: map })
  ac.addEventListener("onconfirm", function (e: any) {
    //鼠标点击下拉列表后的事件
    const tempValue = e.item.value
    const searchValue = tempValue.province + tempValue.city + tempValue.district + tempValue.street + tempValue.business
    setPlace(BMap, map, searchValue)
  })
})

/**
 * 根据输入框的值在地图上添加标记点
 * @param
 *   BMap：地图对象
 *   searchValue：输入框下拉数据选中的值
 * **/
function setPlace(BMap: any, map: any, searchValue: any) {
  map.clearOverlays() //清除地图上所有覆盖物
  const local = new BMap.LocalSearch(map, {
    //智能搜索
    onSearchComplete: (res: any) => {
      const pp = local.getResults().getPoi(0).point //获取第一个智能搜索的结果
      map.centerAndZoom(pp, 21)
      map.addOverlay(new BMap.Marker(pp)) //添加标注
      movePoint(BMap, map, res.Ir[0].point)
    }
  })
  local.search(searchValue)
}

/**
 * 移动标记点
 * @param
 *   BMap：地图对象
 *   latlng：经纬度
 * **/
function movePoint(BMap: any, map: any, latlng: any) {
  map.clearOverlays() //清除地图上所有覆盖物
  //使用BMap命名空间下的Point类来创建一个坐标点
  const point = new BMap.Point(latlng.lng, latlng.lat)
  const marker = new BMap.Marker(point, {
    enableDragging: true
  })
  map.addOverlay(marker)
  latlngToAddress(BMap, latlng)

  // 覆盖物拖拽开始事件
  marker.addEventListener("dragstart", function (e: any) {
    // 清除一些覆盖物
    console.log("[开始]", e)
  })
  // 覆盖物拖拽事件
  marker.addEventListener("dragend", function () {
    const nowPoint = marker.getPosition() // 拖拽完成之后坐标的位置(经纬度)
    latlngToAddress(BMap, nowPoint)
  })
}

/**
 * 地址解析
 * @param
 *   BMap：地图对象
 *   latlng：经纬度
 * **/
function latlngToAddress(BMap: any, latlng: any) {
  const geoc = new BMap.Geocoder()
  geoc.getLocation(latlng, function (rs: any) {
    // console.log(rs.surroundingPois[0])
    address.value = rs.surroundingPois[0].address + rs.surroundingPois[0].title
    latitude.value = rs.surroundingPois[0].point.lat
    longitude.value = rs.surroundingPois[0].point.lng
  })
}

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  name: "",
  address: "",
  description: "",
  longitude: 0,
  latitude: 0,
  logoUrl: "",
  imageUrl: ""
})
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入博物馆名称" }],
  address: [{ required: true, trigger: "blur", message: "请输入博物馆地址" }],
  description: [{ required: true, trigger: "blur", message: "请输入博物馆描述" }]
})
const handleOpenAdd = () => {
  dialogVisible.value = true
}
const file = ref<any>()
const fileUrl = ref("")
const fileList = ref<any[]>([])
const file2 = ref<any>()
const fileUrl2 = ref("")
const fileList2 = ref<any[]>([])
const museumLogoUrl = ref("")
const museumImageUrl = ref("")
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        const param = new FormData()
        param.append("file", file.value)
        // console.log(fileList.value)
        uploadFile(param).then((res) => {
          museumLogoUrl.value = res.data.data
          formData.logoUrl = res.data.data

          /** 提交第二个图片文件 */
          const param2 = new FormData()
          param2.append("file", file2.value)
          // console.log(param2.get("file"))
          uploadFile(param2).then((res) => {
            museumImageUrl.value = res.data.data
            formData.imageUrl = res.data.data

            addMuseumApi({
              name: formData.name,
              address: formData.address,
              description: formData.description,
              longitude: formData.longitude,
              latitude: formData.latitude,
              logoUrl: museumLogoUrl.value,
              imageUrl: museumImageUrl.value
            }).then(() => {
              ElMessage.success("新增成功")
              dialogVisible.value = false
              getMuseumList()
            })
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
/** 上传文件相关 */
const handleUpload = () => {
  return new Promise((resolve, reject) => {
    // console.log(file.value)
    if (file.value === undefined) {
      museumLogoUrl.value = formData.logoUrl
      resolve(true)
    } else {
      const param = new FormData()
      param.append("file", file.value)
      // console.log(fileList.value)
      uploadFile(param)
        .then((res) => {
          museumLogoUrl.value = res.data.data
          // console.log(res)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    }
  })
}
const handleUpload2 = () => {
  return new Promise((resolve, reject) => {
    // console.log(file2.value)
    if (file2.value === undefined) {
      museumImageUrl.value = formData.imageUrl
      resolve(true)
    } else {
      const param2 = new FormData()
      param2.append("file", file2.value)
      //console.log(param2)
      uploadFile(param2)
        .then((res) => {
          museumImageUrl.value = res.data.data
          // console.log(res)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    }
    // console.log(museumImageUrl.value)
  })
}
const handleUpdate = async () => {
  await handleUpload()
  await handleUpload2()
  updateMuseumApi({
    id: currentUpdateId.value as number,
    name: formData.name,
    address: formData.address,
    description: formData.description,
    longitude: formData.longitude,
    latitude: formData.latitude,
    logoUrl: museumLogoUrl.value,
    imageUrl: museumImageUrl.value
  }).then(() => {
    // console.log(res)
    ElMessage.success("修改成功")
    dialogVisible.value = false
    getMuseumList()
  })
}
const beforeUpload = (_file: any) => {
  fileUrl.value = URL.createObjectURL(_file)
  return false
}
const beforeUpload2 = (_file: any) => {
  fileUrl2.value = URL.createObjectURL(_file)
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
const handlePictureChange2 = (_file: any, _fileList: any) => {
  if (_file) {
    const extension = _file.name.substring(_file.name.lastIndexOf(".") + 1)
    const size = _file.size / 1024 / 1024
    if (extension !== "jpg" && extension !== "png" && extension !== "jpeg") {
      ElMessage.warning("请上传后缀名为.jpg或.jpeg或.png的图片")
    }
    if (size > 20) {
      ElMessage.warning("文件大小请不要超过20MB")
    }
    file2.value = _file.raw
    //fileList2.value = _fileList
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
  formData.name = ""
  formData.address = ""
  formData.description = ""
  formData.longitude = 0
  formData.latitude = 0
  formData.logoUrl = ""
  formData.imageUrl = ""
  file.value = undefined
  file2.value = undefined
}
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
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
  currentStates.value = row.service === true ? "正常" : "关闭"
  targetStates.value = row.service === false ? "经营" : "关闭"
  const data = [
    `当前博物馆: ${row.name}`,
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
    changeMuseumServiceApi({
      service: !row.service,
      id: row.id
    }).then(() => {
      ElMessage.success("状态切换成功")
      getMuseumList()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdateOpen = (row: any) => {
  fileList.value = []
  fileList2.value = []
  currentUpdateId.value = row.id
  formData.name = row.name
  formData.address = row.address
  formData.description = row.description
  formData.longitude = row.longitude
  formData.latitude = row.latitude
  formData.logoUrl = row.logoUrl
  formData.imageUrl = row.imageUrl

  fileList.value.push({ url: row.logoUrl as string })
  fileList2.value.push({ url: row.imageUrl as string })
  dialogVisible.value = true
}
//#endregion

//#region 查
/** 获取博物馆列表 */
const museumList = ref<any[]>([])
const getMuseumList = () => {
  loading.value = true
  getMuseumListApi({
    current: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.name || undefined,
    createTime: searchData.createTime || undefined,
    updateTime: searchData.updateTime || undefined,
    order: searchData.order || undefined
  })
    .then((res: any) => {
      paginationData.total = res.data.data.total
      museumList.value = res.data.data.data
    })
    .catch(() => {
      museumList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

/** 显示博物馆图片 */
const imageDialogVisible = ref(false)
const chosenMuseumImage = ref("")
const chosenMuseumName = ref("")
const showMuseumImage = (item: any) => {
  chosenMuseumImage.value = item.imageUrl
  chosenMuseumName.value = item.name
  imageDialogVisible.value = true
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
  name: "",
  order: "",
  createTime: [],
  updateTime: []
})
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getMuseumList()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getMuseumList()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getMuseumList()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getMuseumList, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="博物馆名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="createTime" label="创建时间">
          <el-input v-model="searchData.createTime[0]" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="updateTime" label="更新时间">
          <el-input v-model="searchData.updateTime[0]" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleOpenAdd">新增博物馆</el-button>
          <!-- <el-button type="danger" :icon="Delete">批量删除</el-button> -->
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <!-- 博物馆卡片展示 -->
      <div class="card-wrapper">
        <el-card class="card-box" v-for="item in museumList" :key="item.id">
          <template v-slot:header>
            <div class="clearfix">
              <el-image v-if="item.logoUrl.length" class="logo" :src="item.logoUrl" fit="contain" />
              <el-empty v-else class="logo" :image-size="35" description="未上传" style="width: 8%" />
              <span class="museum_name">{{ item.name }}</span>
              <el-button class="item_button" type="primary" plain @click="handleUpdateOpen(item)">修改信息</el-button>
              <el-button class="item_button" type="primary" plain @click="handleChange(item)">切换经营状态</el-button>
            </div>
          </template>
          <div class="text item">
            <span>地址: {{ item.address }}</span>
          </div>
          <div class="text item">
            <span>经度: {{ item.longitude }}</span>
          </div>
          <div class="text item">
            <span>纬度: {{ item.latitude }}</span>
          </div>
          <div class="item">
            <span
              >经营状态:
              <el-tag v-if="item.service" type="success" effect="plain">正常</el-tag>
              <el-tag v-else type="danger" effect="plain">关闭</el-tag>
            </span>
          </div>
          <div class="text item">
            <span>描述: <br />{{ item.description }}</span>
          </div>
          <div class="item">
            <el-button type="primary" plain style="align-self: center" @click="showMuseumImage(item)"
              >查看博物馆图片</el-button
            >
            <el-dialog
              v-model="imageDialogVisible"
              :title="chosenMuseumName"
              style="display: block"
              @close="imageDialogVisible = false"
              width="50%"
            >
              <el-image :src="chosenMuseumImage" style="margin: auto" />
            </el-dialog>
          </div>
        </el-card>

        <!-- 表格形式的博物馆 -->
        <!-- <el-table :data="museumList">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="id" align="center" sortable />
          <el-table-column prop="name" label="名称" align="center" />
          <el-table-column prop="address" label="地址" align="center" />
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="longitude" label="经度" align="center" />
          <el-table-column prop="latitude" label="纬度" align="center" /> -->
        <!-- <el-table-column prop="institutionId" label="博物馆" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.institutionId === null" type="danger" effect="plain">暂无</el-tag>
              <el-tag v-else type="success" effect="plain">{{ getMuseumName(scope.row) }}</el-tag>
            </template>
          </el-table-column> -->
        <!-- <el-table-column prop="service" label="经营状态" align="center" sortable>
            <template #default="scope">
              <el-tag v-if="scope.row.service" type="success" effect="plain">正常</el-tag>
              <el-tag v-else type="danger" effect="plain">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleChange(scope.row)">切换状态</el-button>
            </template>
          </el-table-column>
        </el-table> -->
      </div>
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
    </el-card>

    <!-- 图片预览 组件 -->
    <el-dialog v-model="previewPicDialog" @close="previewPicDialog = false" style="display: block" width="50%">
      <el-image :src="previewImage" style="margin: auto" />
    </el-dialog>
    <!-- 新增/修改 组件 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增博物馆' : '修改博物馆信息'"
      @close="resetForm"
      width="50%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="博物馆名">
          <el-input v-model="formData.name" placeholder="请输入博物馆名" />
        </el-form-item>
        <el-form-item prop="address" label="博物馆地址">
          <el-input v-model="formData.address" placeholder="请输入博物馆地址" />
          <el-icon @click="handleMapOpen"><Edit /></el-icon>
        </el-form-item>
        <el-form-item prop="description" label="博物馆描述">
          <el-input type="textarea" v-model="formData.description" placeholder="请输入博物馆描述" />
        </el-form-item>
        <el-form-item prop="longitude" label="经度">
          <el-input v-model.number="formData.longitude" type="number" />
        </el-form-item>
        <el-form-item prop="latitude" label="纬度">
          <el-input v-model.number="formData.latitude" type="number" />
        </el-form-item>
        <el-form-item prop="logoUrl" label="上传logo图片">
          <!-- <el-input v-model="formData.logoUrl" /> -->
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
            <el-icon><Plus class="el-icon-circle-plus-outline uploader-icon" /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item prop="imageUrl" label="上传外观图片">
          <!-- <el-input v-model="formData.imageUrl" /> -->
          <el-upload
            class="uploader"
            action=""
            ref="upload2"
            :limit="1"
            :file-list="fileList2"
            list-type="picture-card"
            accept=".jpg,.png,.jpeg,.JPG,.JPEG"
            :auto-upload="false"
            :before-upload="beforeUpload2"
            :on-exceed="handlePictureExceed"
            :on-preview="handlePictureCardPreview"
            :on-change="handlePictureChange2"
            :on-remove="handlePictureRemove"
          >
            <el-icon><Plus class="el-icon-circle-plus-outline uploader-icon" /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>

    <!-- 地图组件 -->
    <el-dialog v-model="mapDialogVisible" @close="mapDialogVisible = false">
      <div id="map" />
      <div id="r-result">
        <span>请输入地址: </span>
        <input type="text" id="suggestId" size="20" value="" />
      </div>
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

.card-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
.card-box {
  margin-top: 10px;
  background-color: rgb(246, 249, 251);
}

// .clearfix:before,
.clearfix {
  //display: inline-block;
  //text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  vertical-align: top;
}
// .clearfix:after {
//   clear: both;
// }

.item {
  margin-bottom: 18px;
}
.text {
  line-height: 200%;
}
:deep(.el-empty__description) {
  float: left;
}
.logo {
  //float: left;
  //display: table-cell;
  display: inline-block;
  align-items: center;
  vertical-align: middle;
  width: 17%;
  padding: 0;
}

.museum_name {
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
  align-self: center;
  vertical-align: middle;
}

.item_button {
  float: right;
  margin-left: 8px;
  display: inline;
  text-align: right;
  align-self: middle;
  //vertical-align: middle;
  justify-self: center;
}

.uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader .el-upload:hover {
  border-color: #409eff;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

#map {
  border: 1px solid red;
  width: 100%;
  height: 600px;
}
#suggestId {
  border: 1px solid red;
  width: 300px;
  height: 30px;
}
</style>
