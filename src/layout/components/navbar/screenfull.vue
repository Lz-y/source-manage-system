<template>
  <div
    class="full-screen"
    :title="isFullscreen ? '退出全屏': '全屏'"
    @click="toggle">
    <el-icon size='18' >
      <FullScreen />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import {useFullscreen} from '@vueuse/core'
import {FullScreen} from '@element-plus/icons-vue'

const {isFullscreen, toggle} = useFullscreen()
</script>