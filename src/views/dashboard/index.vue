<script lang="ts" setup>
import { h, ref } from "vue"
import { useUserStore } from "@/store/modules/user"
import AdminDashboard from "./admin/index.vue"
import EditorDashboard from "./editor/index.vue"
//import { ElNotification } from "element-plus"

type CurrentRoleType = "sys_admin" | "museum_admin"

const userStore = useUserStore()
const currentRole = ref<CurrentRoleType>("sys_admin")
if (!userStore.roles.includes("sys_admin")) {
  currentRole.value = "museum_admin"
}
</script>

<template>
  <component :is="currentRole === 'sys_admin' ? AdminDashboard : EditorDashboard" />
</template>
