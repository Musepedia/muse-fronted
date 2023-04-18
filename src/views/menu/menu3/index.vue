<template>
  <div>
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

    <div class="museum-title">我的博物馆</div>
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

    <div class="today-user-analysis">
      <el-row :gutter="25">
        <el-col :span="6">
          <el-card shadow="always">
            <div class="small-title">今日用户新增</div>
            <div class="today-new-user">{{ user }}</div>
          </el-card>
        </el-col>

        <el-col :span="18">
          <el-card shadow="always">
            <div class="custom-calendar">
              <el-calendar v-model="value" style="">
                <template #date-cell="{ data }">
                  <p :class="data.isSelected ? 'is-selected' : 'not-selected'">
                    {{ data.day.split("-")[2] }}
                  </p>
                </template>
              </el-calendar>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="app-container">
      <v-chart class="vuechart" :autoresize="true" :option="option" />
      <el-space wrap>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span class="card-header-font">热门展区</span>
            </div>
          </template>
          <div v-for="(item, index) in hotHallList" :key="item.id">
            <span class="text item"
              ><el-icon><Medal /></el-icon>{{ index }} {{ item.name }}</span
            >
            <span class="trending-score">热度：{{ item.trendingScore }}</span>
            <el-divider />
          </div>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span class="card-header-font">热门展品</span>
            </div>
          </template>
          <div v-for="(item, index) in hotExhibitList" :key="item.id">
            <span class="text item"
              ><el-icon><Medal /></el-icon>{{ index }} {{ item.label }}</span
            >
            <span class="trending-score">热度：{{ item.trendingScore }}</span>
            <el-divider />
          </div>
        </el-card>
      </el-space>
    </div>
    <!-- <PageFooter /> -->
  </div>
</template>

<script lang="ts">
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { LineChart } from "echarts/charts"
import { GridComponent, TitleComponent, TooltipComponent } from "echarts/components"
import VChart, { THEME_KEY } from "vue-echarts"
import { ref, defineComponent, provide } from "vue"
import { getNewUserApi, getHotHallApi, getHotExhibitApi } from "@/api/dataAnalysis"
import { useUserStoreHook } from "@/store/modules/user"
import moment from "moment"
import { getMuseumListApi } from "@/api/adminMuseum"
import { ElMessage } from "element-plus"
import { useRouter } from "vue-router"
// import { PageFooter } from "@/layout/components"

use([CanvasRenderer, LineChart, GridComponent, TitleComponent, TooltipComponent])

export default defineComponent({
  name: "HelloWorld",
  components: {
    VChart
  },
  provide: {
    [THEME_KEY as any]: "light"
  },
  setup() {
    const userStore = useUserStoreHook()
    const router = useRouter()

    const loading = ref(false) //通用加载
    const choseMuseumDialogVisible = ref(true)
    const museumChosen = ref<number>()
    museumChosen.value = Number.isNaN(parseInt(window.sessionStorage.getItem("museumChosen") as string))
      ? undefined
      : parseInt(window.sessionStorage.getItem("museumChosen") as string)
    const createData = () => {
      loading.value = true
      userStore.getInfo()
      if (userStore.museumID !== null || museumChosen.value !== undefined) {
        loading.value = false
        choseMuseumDialogVisible.value = false
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
    /* 获取博物馆列表 */
    const museumList = ref<any[]>([])
    const getMuseumList = () => {
      loading.value = true
      getMuseumListApi({
        current: 1,
        size: 9999,
        name: undefined
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
      } else {
        ElMessage.warning("还未选择博物馆！")
      }
    }

    /** 获取今日用户新增 */
    const user = ref<number>(0)
    const countList = ref<any[]>([])

    const getTodayNewUser = () => {
      const endDate = moment(new Date()).format("YYYY-MM-DD")
      const beginDate = moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD")
      // const year = date.getFullYear()
      // const month = date.getMonth() + 1
      // const day = date.getDate()
      // const beginDate: string = year + "-" + month + "-" + (day - 1)
      // const endDate: string = year + "-" + month + "-" + day
      // beginDate = new SimpleDateFormat("yyyy-MM-dd").parse(beginDate)
      getNewUserApi({
        beginDate: beginDate,
        endDate: endDate,
        museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number
      }).then((res) => {
        countList.value = res.data.data
        user.value = countList.value.reduce(function (prev, cur, countList) {
          return prev.count + cur.count
        })
        //user.value = res.data.data.count
        // console.log(res.data, user.value)
      })
    }
    getTodayNewUser()

    /** 获取过去一周的流量--图表数据 */
    const weekUserList = ref<any[]>([])
    const weekTrafficList = ref<any[]>([])
    const getWeekTraffic = () => {
      const endDate = moment(new Date()).format("YYYY-MM-DD")
      const beginDate = moment(new Date().setDate(new Date().getDate() - 6)).format("YYYY-MM-DD")
      getNewUserApi({
        beginDate: beginDate,
        endDate: endDate,
        museumId: (userStore.museumID !== null ? userStore.museumID : museumChosen.value) as number
      }).then((res) => {
        weekUserList.value = res.data.data
        for (const item of weekUserList.value) {
          weekTrafficList.value.push(item.count)
        }
      })
    }
    getWeekTraffic()
    const value = ref(new Date())
    const option = ref({
      title: {
        text: "过去一周的用户流量",
        left: "center"
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          // data: [820, 932, 901, 934, 1290, 1330, 1320],
          data: weekTrafficList.value,
          type: "line",
          smooth: false
        }
      ]
    })

    /** 获取热门展区 */
    const hotHallList = ref<any[]>([
      {
        id: 1,
        name: "起源之谜",
        trendingScore: 8899
      },
      {
        id: 2,
        name: "生命长河",
        trendingScore: 8108
      },
      {
        id: 3,
        name: "大地探珍",
        trendingScore: 7999
      },
      {
        id: 4,
        name: "未来之路",
        trendingScore: 6000
      },
      {
        id: 5,
        name: "演化之道",
        trendingScore: 5678
      },
      {
        id: 6,
        name: "上海故事",
        trendingScore: 3500
      }
    ])
    const getHotHall = () => {
      getHotHallApi({
        k: 6,
        museumId: (userStore.museumID !== null ? userStore.museumID : 0) as number
      }).then((res) => {
        if (res.data.data.length === 0) {
          console.log()
        } else {
          hotHallList.value = res.data.data
        }
      })
    }
    getHotHall()

    /** 获取热门展品 */
    const hotExhibitList = ref<any[]>([
      {
        id: 1,
        label: "海葵",
        trendingScore: 9999
      },
      {
        id: 2,
        label: "棘龙",
        trendingScore: 8770
      },
      {
        id: 3,
        label: "萨斯特鱼龙",
        trendingScore: 7890
      },
      {
        id: 4,
        label: "阿根廷龙",
        trendingScore: 7600
      },
      {
        id: 5,
        label: "磷虾",
        trendingScore: 6899
      },
      {
        id: 6,
        label: "岩羊",
        trendingScore: 5743
      }
    ])
    const getHotExhibit = () => {
      getHotExhibitApi({
        k: 6,
        museumId: (userStore.museumID !== null ? userStore.museumID : 0) as number
      }).then((res) => {
        if (res.data.data.length === 0) {
          console.log()
        } else {
          hotExhibitList.value = res.data.data
        }
      })
    }
    getHotExhibit()

    createData()

    return {
      option,
      value,
      user,
      hotHallList,
      hotExhibitList,
      userStore,
      museumChosen,
      museumList,
      handleChoseMuseumAgain,
      choseMuseumDialogVisible,
      handleChoseMuseumClose,
      handleChoseMuseum
    }
  }
})
</script>

<style scoped lang="scss">
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
:deep().el-calendar__body {
  padding: 0;
}
:deep().el-calendar-day .el-calendar-table {
  box-sizing: border-box;
  padding: 10px 0 15px 0;
  height: 30px;
}
:deep().el-calendar-day:hover {
  cursor: pointer;
  background-color: rgb(104, 143, 235);
  color: #fff;
}
:deep().el-calendar-table tr td:first-child {
  border-left: none;
}
:deep().el-calendar-table td tr:first-child {
  border-top: none;
}
:deep().el-calendar-table td {
  border-bottom: none;
  border-right: none;
  vertical-align: center;
}
:deep().el-calendar-table__row {
  text-align: center;
  vertical-align: center;
}
/* :deep().el-calendar-table .current .el-calendar-day:hover {
cursor: pointer;
background-color: rgb(104,143,235);
color: black;
border-radius: 10px;
}
:deep().el-calendar-table .prev .el-calendar-day:hover,
:deep().el-calendar-table .next .el-calendar-day:hover {
color: gray;
background-color: #fff;
} */
:deep().is-selected {
  color: black;
}
:deep().not-selected {
  color: gray;
}
.museum-title {
  font-size: 22px;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 5%;
}
.today-user-analysis {
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 20px;
}
.small-title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 25%;
  text-align: center;
}
.today-new-user {
  font-size: 36px;
  font-weight: bold;
  color: #ff6839;
  margin-top: 20%;
  margin-bottom: 25%;
  text-align: center;
}
.vuechart {
  height: 400px;
}

.card-header-font {
  font-weight: bold;
  font-size: large;
}
.box-card {
  display: block;
  justify-content: center;
  width: 100%;
  height: 380px;
  overflow: auto;
}

:deep().el-space {
  display: flex;
  justify-content: center;
}

:deep().el-space__item {
  width: 45%;
}

.item {
  word-spacing: 10px;
  line-height: 30px;
}

:deep().el-divider--horizontal {
  margin: 5px 0;
}

.trending-score {
  float: right;
  color: rgb(177, 175, 175);
  font-size: 0.8em;
}
</style>
