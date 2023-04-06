<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { useUserStoreHook } from "@/store/modules/user"
import { getZoneListApi } from "@/api/MuseumZone"
import { useRouter } from "vue-router"
import { getExhibitListApi } from "@/api/MuseumExhibit"
import { getMuseumListApi } from "@/api/adminMuseum"
import { getQuestionListApi, updateQuestionApi } from "@/api/question"
import { ElInput, ElMessage, type FormInstance, type FormRules } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { Refresh, Search } from "@element-plus/icons-vue"
// import { PageFooter } from "@/layout/components"

const router = useRouter()
const userStore = useUserStoreHook()
//分页
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

/** 通用加载 */
const loading = ref(false)

/** 加载数据 */
/** 若为系统管理员，先选择博物馆 */
const choseMuseumDialogVisible = ref(true)
const createData = () => {
  loading.value = true
  userStore.getInfo()
  if (userStore.museumID !== null || museumChosen.value !== undefined) {
    loading.value = false
    choseMuseumDialogVisible.value = false
    getQuestionList()
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
    await getQuestionList()
    await getZoneList()
  } else {
    ElMessage.warning("还未选择博物馆！")
  }
}

/**
 * 查询区域
 */
const exhibitChosen = ref<number>()
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  createTime: [],
  updateTime: [],
  order: "",
  questionText: "",
  answerType: undefined,
  answerText: ""
})
const typeList = reactive([
  {
    id: 0,
    label: "无法回答"
  },
  {
    id: 1,
    label: "文本答案"
  },
  {
    id: 2,
    label: "地图答案"
  },
  {
    id: 3,
    label: "图片答案"
  }
])
/** 获取指定博物馆的问题列表 */
const questionList = ref<any[]>([])
const getQuestionList = () => {
  loading.value = true
  getQuestionListApi({
    current: paginationData.currentPage,
    size: paginationData.pageSize,
    museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
    exhibitId: exhibitChosen.value,
    createTime: searchData.createTime || undefined,
    updateTime: searchData.updateTime || undefined,
    order: searchData.order || undefined,
    questionText: searchData.questionText || undefined,
    answerType: searchData.answerType === 0 ? 0 : searchData.answerType || undefined,
    answerText: searchData.answerText || undefined
  })
    .then((res: any) => {
      paginationData.total = res.data.data.total
      questionList.value = res.data.data.data
    })
    .catch(() => {
      questionList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getQuestionList()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  zoneChosen.value = undefined
  exhibitChosen.value = undefined
  if (paginationData.currentPage === 1) {
    getQuestionList()
  }
  paginationData.currentPage = 1
}
/**
 * end region
 */

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
      current: 1,
      size: 9999,
      museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
      exhibitionHallId: zoneChosen.value
    })
      .then((res) => {
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

/** 展区选择变化时，相应做出反应 */
const handleZoneChange = () => {
  exhibitChosen.value = undefined
}

/** 查看问题详情 */
const currentDetailId = ref<number>() //当前查看的展品id
const detailDialogVisible = ref(false)
const questionTextDetail = ref("")
const answerTextDetail = ref("")
const answerTypeDetail = ref("")
const exhibitNameDetail = ref("")
const exhibitIdDetail = ref<number>()
const museumNameDetail = ref("")
const questionFreqDetail = ref<number>()
const answerTypeNumber = ref<number>()
const handleDetails = (item: any) => {
  detailDialogVisible.value = true
  currentDetailId.value = item.id
  questionTextDetail.value = item.questionText
  answerTextDetail.value = item.answerText
  exhibitNameDetail.value = item.exhibitName
  exhibitIdDetail.value = item.exhibitId
  museumNameDetail.value = item.museumName
  questionFreqDetail.value = item.questionFreq
  answerTypeNumber.value = item.answerType
  if (answerTypeNumber.value === 1) {
    answerTypeDetail.value = "文本答案"
  } else if (answerTypeNumber.value === 2) {
    answerTypeDetail.value = "地图答案"
  } else if (answerTypeNumber.value === 3) {
    answerTypeDetail.value = "图片答案"
  } else {
    answerTypeDetail.value = "无法回答"
  }
}
// 在详情页修改回答文本
const isChangable = ref(false)
const handleUpdateAnswer = () => {
  isChangable.value = false
  updateQuestionApi({
    id: currentDetailId.value as number,
    exhibitId: exhibitIdDetail.value as number,
    answerType: answerTypeNumber.value as number,
    answerText: answerTextDetail.value
  }).then(() => {
    ElMessage.success("回答修改成功")
    getQuestionList()
  })
}
/** end */

/**
 * 问题修改 相关
 */
/** 修改会话弹窗相关参数与函数 */
const dialogVisible = ref(false)
const zoneUpdated = ref<number>()
const exhibitUpdated = ref<number>()
const questionFormRef = ref<FormInstance | null>(null)
const questionForm = reactive({
  answerText: "",
  answerType: 0,
  exhibitName: "",
  exhibitId: 0
})
const questionFormRules: FormRules = reactive({
  answerText: [{ required: true, trigger: "blur", message: "请输入回答" }],
  answerType: [{ required: true, trigger: "blur", message: "请选择答案类型" }]
})

const exhibitUpdatedList = ref<any[]>([])
const handleZoneUpdated = () => {
  questionForm.exhibitName = ""
  getExhibitUpdatedList()
}
const getExhibitUpdatedList = () => {
  loading.value = true
  if (zoneUpdated.value !== undefined) {
    getExhibitListApi({
      current: 1,
      size: 9999,
      museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number,
      exhibitionHallId: zoneUpdated.value as number
    })
      .then((res) => {
        exhibitUpdatedList.value = res.data.data.data
      })
      .catch(() => {
        exhibitUpdatedList.value = []
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    loading.value = false
  }
}

/** 打开修改问题弹窗 一些props */
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdateOpen = (item: any) => {
  currentUpdateId.value = item.id
  questionForm.answerText = item.answerText
  questionForm.answerType = item.answerType
  questionForm.exhibitName = item.exhibitName
  questionForm.exhibitId = item.exhibitId
  // exhibitUpdated.value = item.exhibitId
  questionTextDetail.value = item.questionText

  dialogVisible.value = true
}

/** 修改问题接口 */
const handleCreate = () => {
  questionFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      updateQuestionApi({
        id: currentDetailId.value as number,
        exhibitId: exhibitUpdated.value !== undefined ? exhibitUpdated.value : questionForm.exhibitId,
        answerText: questionForm.answerText,
        answerType: questionForm.answerType as number
      }).then(() => {
        ElMessage.success("问题修改成功")
        dialogVisible.value = false
        getQuestionList()
      })
    } else {
      return false
    }
  })
}

/** 关闭修改窗口后的表单重置操作 */
const resetForm = () => {
  currentUpdateId.value = undefined
  questionForm.answerText = ""
  questionForm.answerType = 0
  exhibitUpdated.value = 0
  questionTextDetail.value = ""
}

/** 关闭修改窗口的操作 */
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

createData()

watch([() => paginationData.currentPage, () => paginationData.pageSize], getQuestionList)
watch(zoneChosen, getExhibitList, { immediate: true })
</script>

<template>
  <div class="app-container">
    <!-- 选择博物馆 组件 -->
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
    </el-row>

    <!-- 查询索引框 -->
    <el-card v-loading="loading" class="search-wrapper" shadow="never">
      <el-form ref="searchFormRef" :inline="true" :model="searchData" label-position="left">
        <!-- <el-form-item prop="createTime" label="创建时间">
          <el-input v-model="searchData.createTime[0]" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="updateTime" label="更新时间">
          <el-input v-model="searchData.updateTime[0]" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="展区展品">
          <el-select v-model="zoneChosen" placeholder="请选择展区" style="width: 250px" @change="handleZoneChange">
            <el-option v-for="item in zoneList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="exhibitChosen" placeholder="请选择展品" style="margin: 5px 5px; width: 250px">
            <el-option v-for="item in exhibitList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="答案类型" prop="answerType">
          <el-select v-model="searchData.answerType" placeholder="请选择答案类型" style="width: 250px">
            <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="问题文本" prop="questionText">
          <el-input v-model="searchData.questionText" placeholder="请输入" style="width: 250px" />
        </el-form-item>
        <el-form-item label="回答文本" prop="answerText">
          <el-input v-model="searchData.answerText" placeholder="请输入" style="width: 250px" />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button :icon="Search" type="primary" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 问题陈列 -->
    <el-row>
      <el-col v-for="(item, index) in questionList" :key="item.id" :offset="index % 3 === 0 ? 2 : 1" :span="6">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" style="margin-bottom: 10px">
          <div class="question-block">
            <span>{{ item.questionText }}</span>
          </div>
          <el-divider />
          <div class="answer-block">
            <span v-if="item.answerText">{{ item.answerText }}</span>
            <span v-else><span>暂无回答</span></span>
          </div>
          <div style="padding: 14px">
            <span
              >所属展品：<el-tag>{{ item.exhibitName ? item.exhibitName : "无" }}</el-tag></span
            >
            <span style="margin-left: 15px">
              <el-tag v-if="item.answerType === 1" effect="plain" type="success">文本答案</el-tag>
              <el-tag v-else-if="item.answerType === 2" effect="plain" type="success">地图答案</el-tag>
              <el-tag v-else-if="item.answerType === 3" effect="plain" type="success">图片答案</el-tag>
              <el-tag v-else effect="plain" type="danger">无法回答</el-tag>
            </span>
            <div class="bottom">
              <el-button class="button" @click="handleDetails(item)">查看</el-button>
              <el-button class="button" @click="handleUpdateOpen(item)">修改</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- <el-col :span="6" :offset="questionList.length % 3 === 0 ? 2 : 1">
        <el-card class="add-icon-container" :body-style="{ padding: '0px' }" shadow="never">
          <el-button text :icon="Plus" @click="handleOpenAddZone" />
        </el-card>
      </el-col> -->
    </el-row>
    <!-- 分页 组件 -->
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

    <!-- 问题详情 组件 -->
    <el-dialog v-model="detailDialogVisible" title="问题详情" @close="detailDialogVisible = false">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="问题: ">{{ questionTextDetail }}</el-descriptions-item>
        <el-descriptions-item label="所属博物馆-展品: "
          >{{ museumNameDetail + " -- " + exhibitNameDetail }}
        </el-descriptions-item>
        <el-descriptions-item label="答案类型: ">
          <el-tag>{{ answerTypeDetail }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="回答: ">
          <div v-if="isChangable === false">
            {{ answerTextDetail }}
            <el-button plain type="warning" @click="isChangable = true">修改回答</el-button>
          </div>
          <div v-else>
            <el-input v-model="answerTextDetail" placeholder="请输入回答" />
            <el-button plain type="warning" @click="handleUpdateAnswer">提交修改</el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="提问频率: ">
          {{ questionFreqDetail }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 问题修改 组件 -->
    <el-dialog v-model="dialogVisible" :title="questionTextDetail" width="50%" @close="resetForm">
      <el-form
        ref="questionFormRef"
        :model="questionForm"
        :rules="questionFormRules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="回答文本" prop="answerText">
          <el-input v-model="questionForm.answerText" placeholder="请输入回答文本" />
        </el-form-item>
        <el-form-item label="答案类型" prop="answerType">
          <el-select v-model="questionForm.answerType" placeholder="请选择答案类型">
            <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属展品" prop="exhibitName">
          <el-select v-model="zoneUpdated" clearable placeholder="请选择展区" @change="handleZoneUpdated">
            <el-option v-for="item in zoneList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="exhibitUpdated" clearable placeholder="请选择展品" style="margin: 5px 5px">
            <el-option v-for="item in exhibitUpdatedList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>

    <!-- <PageFooter /> -->
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  display: flex;
  width: 90%;
  margin: auto;
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
  background-color: #fefefe;
}

.question-block {
  padding: 30px 0;
  text-align: center;
  font-size: 18px;
  border-right: solid 1px var(--el-border-color);
  display: flex;
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  justify-content: center;
  vertical-align: middle;
}

.answer-block {
  width: 100%;
  height: 110px;
  padding: 25px 25px;
  text-align: center;
  // font-size: 20px;
  border-right: solid 1px var(--el-border-color);
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: auto;
}

.bottom {
  margin-top: 15px;
  display: flex;
  vertical-align: middle;
}

.button {
  margin-left: 0;
  margin-right: 3px;
  padding: 8px 10px;
  width: 60px;
}

.add-icon-container {
  margin-bottom: 10px;
  height: 280px;
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

:deep(.el-divider--horizontal) {
  margin: 0 0;
  border-top: 2px var(--el-border-color) var(--el-border-style);
}
</style>
