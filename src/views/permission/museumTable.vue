<script lang="ts" setup>
import { ref } from "vue"
import { checkPermission } from "@/utils/permission" // checkPermission 权限判断函数
// import SwitchRoles from "./components/SwitchRoles.vue"

/** key 是为了能每次切换权限的时候重新初始化指令 */
const key = ref(1)
// const handleRolesChange = () => {
//   key.value++
// }
</script>

<template>
  <div class="app-container">
    <div :key="'checkPermission' + key" class="margin-top">
      <el-tabs type="border-card" class="margin-top">
        <el-tab-pane v-if="checkPermission(['sys_admin'])" label="admin">
          admin 可以看见这个
          <el-tag class="permission-code" type="info"> v-if="checkPermission(['admin'])" </el-tag>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['museum_admin'])" label="editor">
          editor 可以看见这个
          <el-tag class="permission-code" type="info"> v-if="checkPermission(['editor'])" </el-tag>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['sys_admin', 'museum_admin'])" label="admin 和 editor">
          两者 sys_admin 和 museum_admin 都可以看见这个
          <el-tag class="permission-code" type="info"> v-if="checkPermission(['admin', 'editor'])" </el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.permission-alert {
  width: 320px;
  margin-top: 15px;
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
}

.permission-code {
  margin-left: 15px;
}

.margin-top {
  margin-top: 20px;
}
</style>
