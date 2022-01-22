<template>
  <div class="schedule-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list'>
      <template #finished='{row}'>
        <span :class="row.finished === 0 ? 'invalid' : 'available'">{{row.finished === 0 ? '未完成' : '已完成'}}</span>
      </template>
      <template #operation='{row}'>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定该计划${row.finished === 0 ? '已完成' : '未完成'}？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text'>{{row.finished === 0 ? '已完成' : '未完成'}}</el-button>
          </template>
        </el-popconfirm>
        <el-button type="text" @click="remove(row)">删除</el-button>
      </template>
    </CustomTable>
    <Pagination :total='20' />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue-demi'
import { Search, InfoFilled } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '计划名称', attrs: {placeholder: '请输入计划名称', clearable: true}},
  {name: 'date-picker', prop: 'date', label: '日期', attrs: {placeholder: '请选择日期'}},
  {name: 'select', prop: 'finished', label: '计划状态', options: [{label: '未完成', value: 0}, {label: '已完成', value: 1}, {label: '全部', value: 2}], attrs: {placeholder: '请选择计划状态', clearable: true}}
])
const queryData = reactive<Partial<Schedule>>({
  name: '',
  date: new Date,
  finished: 2
})

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'name', label: '名称' } },
  { attrs: { prop: 'description', label: '描述' } },
  { attrs: { prop: 'finished', label: '计划状态' }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])
const list = ref<Array<Schedule>>([
  {name: '111', description: '111', finished: 0, date: new Date}
])

function toggleStatus (row: Schedule) {
  row.finished = row.finished === 0 ? 1 : 0
}
function remove(row: Schedule) {
}
</script>