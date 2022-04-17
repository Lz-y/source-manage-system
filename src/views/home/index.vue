<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :lg="6"  v-for="item in statistical">
        <div class="card-panel">
          <div class="card-panel-icon">
            <svg-icon :name="item.type.toLowerCase()" size="3"></svg-icon>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-txt">{{item.type}}</div>
            <div class="card-panel-num">{{item.num}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
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
        <el-card :body-style="{padding: '0px'}">
          <Todo></Todo>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
  name: 'Home'
}
</script>
<script setup lang="ts">
import {reactive, ref} from 'vue'

import LineChart from '@/components/chart/line.vue'
import PieChart from '@/components/chart/pie.vue'
import BarChart from '@/components/chart/bar.vue'
import Todo from '@/components/todo/index.vue'

const statistical = ref([
  {type: 'User', num: 120},
  {type: 'Article', num: 120},
  {type: 'Resource', num: 120},
  {type: 'Message', num: 120},
])
</script>

<style lang="scss">
.home{
  .el-row{
    margin-bottom: 20px;
  }
  .card-panel{
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    border-radius: 10px;
    &-txt{
      line-height: 18px;
      color: rgba(0,0,0,.45);
      font-size: 16px;
      margin-bottom: 12px;
    }
    &-num{
      font-size: 20px;
    }
  }
}
</style>