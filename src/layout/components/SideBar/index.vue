<template>
  <el-aside width="180px">
    <el-scrollbar>
      <el-menu
        :default-active="activeRoutes"
        :unique-opened="true"
        router>
        <SideBarItem
          v-for="route in routes"
          :key="route.path"
          :data='route'
          :base-path='route.path' />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { RouterType, useRoute, useRouter } from "vue-router"
import SideBarItem from './Item.vue'

const route = useRoute()

const router = useRouter()

const activeRoutes = computed(() => {
  const {meta, fullPath} = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return fullPath
})

const routes = computed(() => {
  return router.options.routes.filter(item => !item.hidden)
})
</script>

<style lang="scss">
</style>
 