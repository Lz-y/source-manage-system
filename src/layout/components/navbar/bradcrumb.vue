<template>
<el-breadcrumb class="app-breadcrumb" separator='/'>
  <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
    <span
      v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
      class="no-redirect">{{item.meta.title}}</span>
    <a v-else @click.prevent="handleLink(item)">{{item.meta.title}}</a>
  </el-breadcrumb-item>
</el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute, RouteLocationMatched } from 'vue-router'
const router = useRouter()
const route = useRoute()

const levelList = ref<Array<RouteLocationMatched>>([])

function isHome (route: RouteLocationMatched): boolean {
  const name = route && (route.name as string)
  if (!name) {
    return false
  }
  return name.trim().toLocaleLowerCase() === 'home'
}

function getBreadcrumbs () {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]
  if (!isHome(first)) {
    matched.unshift({path: '/home', meta: {title: '首页', icon: 'dashboard'}} as unknown as RouteLocationMatched)
  }
  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta?.breadcrumb !== false)
}
onMounted(() => getBreadcrumbs())

watch(
  () => route.path,
  () => getBreadcrumbs()
)
function handleLink (item: RouteLocationMatched) {
  const {redirect, path} = item
  if (redirect) {
    router.push(redirect.toString())
    return
  }
  router.push(path)
}
</script>

<style lang="scss">
.app-breadcrumb{
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  
  .no-redirect{
    color: #97a8be;
    cursor: text;
  }
}
</style>