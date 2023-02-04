<template>
  <div>
    <div class="museum-title">我的博物馆</div>

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
            <el-divider />
          </div>
        </el-card>
      </el-space>
    </div>
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
    /** 获取今日用户新增 */
    const user = ref<number>(0)
    const countList = ref<any[]>([])
    const userStore = useUserStoreHook()
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
        museumId: (userStore.museumID !== null ? userStore.museumID : 0) as number
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
        museumId: (userStore.museumID !== null ? userStore.museumID : 0) as number
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
    const hotHallList = ref<any[]>([])
    const getHotHall = () => {
      getHotHallApi({
        k: 6,
        museumId: (userStore.museumID !== null ? userStore.museumID : 0) as number
      }).then((res) => {
        hotHallList.value = res.data.data
        console.log(res.data)
      })
    }
    getHotHall()

    /** 获取热门展品 */
    const hotExhibitList = ref<any[]>([])
    const getHotExhibit = () => {
      getHotExhibitApi({
        k: 6,
        museumId: (userStore.museumID !== null ? userStore.museumID : 0) as number
      }).then((res) => {
        hotExhibitList.value = res.data.data
        console.log(res.data)
      })
    }
    getHotExhibit()

    return { option, value, user, hotHallList, hotExhibitList }
  }
})
</script>

<style scoped>
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
</style>
