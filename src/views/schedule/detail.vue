<template>
  <div class="schedule-detail-page">
    <h3 class="schedule-title">计划详情 - 学习 Vue3 响应式原理</h3>
    <Query :configs='configs' :data='queryData' size='small' :label-width="100" style="max-width: 45vw;">
      <el-button type='primary'>保存</el-button>
    </Query>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue-demi'
import Query from '@/components/query.vue'

const configs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '计划名称', attrs: {placeholder: '请输入计划名称', clearable: true}},
  {name: 'date-picker', prop: 'date', label: '所需时间', attrs: { type: 'daterange', rangeSeparator: '-',startPlaceholder: '开始日期',endPlaceholder: '截止日期'}},
  {name: 'select', prop: 'finished', label: '计划状态', options: [{label: '进行中', value: 0}, {label: '已完成', value: 1}], attrs: {placeholder: '请选择计划状态', clearable: true}},
  {name: 'input', prop: 'description', label: '描述', attrs: {type: 'textarea', placeholder: '请输入计划描述'}}
])
const queryData = reactive({
  name: '',
  date: [],
  finished: 0,
  description: ''
})
</script>

<style lang="scss">
.schedule-detail-page{
  padding-top: 20px;
  overflow: hidden;

}
</style>