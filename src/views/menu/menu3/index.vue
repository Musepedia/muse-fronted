<template>
    <div>
      <div class="museum-title">我的博物馆</div>

      <div class="today-user-analysis">
        <el-row :gutter="25">
          <el-col :span="6">
            <el-card :shadow="always">
              <div class="small-title">今日用户新增</div>
              <div class="today-new-user">1</div>
            </el-card>
          </el-col>

          <el-col :span="18">
            <el-card :shadow="always">
              <div class="custom-calendar">
                <el-calendar v-model="value" style="">
                  <template #date-cell="{ data }">
                    <p :class="data.isSelected ? 'is-selected' : 'not-selected'">
                      {{ data.day.split('-')[2] }}
                    </p>
                  </template>
                </el-calendar>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="app-container">
          <v-chart
          class="vuechart"
          :option="option"
          />
      </div>
    </div>

</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, defineComponent } from 'vue';

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TitleComponent,
  TooltipComponent
]);

export default defineComponent({
  name: "HelloWorld",
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: "light"
  },
  setup() {
    const option = ref({
        title: {
            text: "Traffic Sources Test",
            left: "center"
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: false
        }]
    });

    return { option };
  }
});
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
  background-color: rgb(104,143,235);
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
.vuechart{
    height: 400px;
}
</style>