<template>
  <el-header height='50px'>
    <div class="nav-left">
      <Hamburger />
      <Bradcrumb />
    </div>
    <div class="nav-right">
      <Notice />
      <Screenfull />
      <UserInfo />
    </div>
  </el-header>
</template>

<script lang="ts">
export default {
  name: "Navbar"
}
</script>

<script setup lang="ts">
import Bradcrumb from './bradcrumb.vue'
import Hamburger from './hamburger.vue'
import Notice from './notice.vue'
import UserInfo from './userInfo.vue'
import Screenfull from './screenfull.vue'
</script>