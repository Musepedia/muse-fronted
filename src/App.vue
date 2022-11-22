<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import zhCn from "element-plus/lib/locale/lang/zh-cn"

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()
/** 将 Element Plus 的语言设置为中文 */
const locale = zhCn
</script>

<template>
  <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
  <el-footer>
    <el-row class="info">联系邮箱：mimiter@mimiter.com</el-row>
    <el-row class="info">Copyright © 2022 Mimiter Technology. All rights reserved. 米弥特科技 版权所有 </el-row>
    <el-row class="info"><a href="http://beian.miit.gov.cn" target="_blank">沪ICP备2022030073</a></el-row>
  </el-footer>
</template>

<style scoped lang="scss">
.el-footer {
  position: relative;
  width: 100%;
  background-color: #fff;
  height: auto;
}
.info {
  font-family: "Noto Sans SC", sans-serif;
  font-size: 15px;
  text-align: center;
  justify-content: center;
  line-height: 33px;
  margin-top: 0.3em;
}
</style>
