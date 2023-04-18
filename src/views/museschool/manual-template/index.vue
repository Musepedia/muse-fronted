<script lang="ts" setup>
import MuseschoolHeader from "@/views/museschool/components/MuseschoolHeader.vue"
</script>

<template>
  <div class="manual-template">
    <el-header class="header">
      <museschool-header active-name="manual-template" />
    </el-header>
  </div>
</template>

<style lang="scss" scoped>
.manual-template {
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
