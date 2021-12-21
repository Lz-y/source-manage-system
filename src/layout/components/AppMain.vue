<template>
  <el-main>
    <el-scrollbar max-height='100%'>
      <el-backtop title="回到顶部" target='.el-main .page'>
        <Top />
      </el-backtop>
      <router-view v-slot='{Component}'>
        <div class="page">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </div>
      </router-view>
    </el-scrollbar>
  </el-main>
</template>

<script setup lang="ts">
import {Top} from '@element-plus/icons-vue'
</script>