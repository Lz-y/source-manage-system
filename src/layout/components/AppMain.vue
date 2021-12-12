<template>
  <el-main>
    <el-scrollbar class="page" max-height='100%'>
      <router-view v-slot='{Component}'>
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-scrollbar>
  </el-main>
</template>

<script setup lang="ts">

</script>