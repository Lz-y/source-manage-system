<template>
  <el-container>
    <AppSideBar />
    <el-container direction="vertical">
      <AppHeader />
      <AppMain />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import AppSideBar from './components/SideBar/index.vue'
import AppHeader from './components/AppHeader.vue'
import AppMain from './components/AppMain.vue'
</script>
