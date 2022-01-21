<template>
  <div class="home">
    <!-- <el-row :gutter="20">
      <el-col :span="6">
        <svg-icon name="user" size=""></svg-icon>
      </el-col>
      <el-col :span="6">
        <svg-icon name="article"></svg-icon>
      </el-col>
      <el-col :span="6">
        <svg-icon name="resource"></svg-icon>
      </el-col>
      <el-col :span="6">
        <svg-icon name="message"></svg-icon>
      </el-col>
    </el-row> -->
    <el-row :gutter="20">
      <el-col :xl="8" :lg="8" :md="12" :sm="24" :xs="24">
        <el-card>
          <line-chart />
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="24" :xs="24">
        <el-card>
          <pie-chart />
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="24" :xs="24">
        <el-card>
          <bar-chart />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style='margin-top: 10px;'>
          <Todo></Todo>
        </el-card>
      </el-col>
      <el-col></el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
<script setup lang="ts">
import {reactive, ref} from 'vue-demi'

import LineChart from '@/components/chart/line.vue'
import PieChart from '@/components/chart/pie.vue'
import BarChart from '@/components/chart/bar.vue'
import Todo from '@/components/todo/index.vue'

</script>