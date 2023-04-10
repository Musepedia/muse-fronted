<script lang="ts" setup>
import MuseschoolHeader from "@/views/museschool/components/MuseschoolHeader.vue"
</script>

<template>
  <div class="user-manual">
    <el-header class="header">
      <museschool-header active-name="user-manual" />
    </el-header>
  </div>
</template>

<style lang="scss" scoped>
.user-manual {
  width: 100%;
  height: 100%;
  background: rgb(232, 233, 238);
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 0;

  .header {
    width: 100%;
    height: 8%;
    padding: 0;
  }
}
</style>
