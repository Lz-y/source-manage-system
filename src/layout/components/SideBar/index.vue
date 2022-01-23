<template>
  <el-aside width="210px">
    <el-scrollbar>
      <el-menu
        :default-active="activeRoutes"
        unique-opened
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

<script lang="ts">
export default {
  name: 'Sidebar'
}
</script>

<script lang="ts" setup>
import { computed } from "vue"
import { RouteRecordRaw, useRoute, useRouter } from "vue-router"
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
  function filterRoute (data: RouteRecordRaw[]) {
    const newRoute = data.filter(item => !item.meta?.hidden)
    newRoute.forEach(item => item.children && (item.children = filterRoute(item.children)))
    return newRoute
  }
  return filterRoute(router.options.routes)
})
</script>
 