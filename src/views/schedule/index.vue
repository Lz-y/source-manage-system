<template>
  <div class="schedule-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button :icon='CirclePlus' @click="createSchdule">添加计划</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list'>
      <template #finished='{row}'>
        <span :class="row.finished === 0 ? 'invalid' : 'available'">{{row.finished === 0 ? '进行中' : '已完成'}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type="text" @click="edit(row)">编辑</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定该计划${row.finished === 0 ? '已完成' : '未完成'}？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text'>{{row.finished === 0 ? '已完成' : '进行中'}}</el-button>
          </template>
        </el-popconfirm>
        <el-button type="text" @click="remove(row)">删除</el-button>
      </template>
    </CustomTable>
    <Pagination :total='20' />
    <el-dialog v-model="show" :title="title" width="30%">
      <Query :configs='schduleConfigs' :data='scheduleInfo' size='small' :label-width="100" style="max-width: 40vw;">
        <el-button @click.prevent="cancel">取消</el-button>
        <el-button type='primary' @click.prevent="save">保存</el-button>
      </Query>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue-demi'
import { Search, CirclePlus, InfoFilled } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const statusOption = [{label: '未完成', value: 0}, {label: '已完成', value: 1}, {label: '全部', value: 2}]

const configs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '计划名称', attrs: {placeholder: '请输入计划名称', clearable: true}},
  {name: 'date-picker', prop: 'date', label: '所需时间', attrs: {type: 'daterange', rangeSeparator: '-',startPlaceholder: '开始日期', endPlaceholder: '截止日期'}},
  {name: 'select', prop: 'finished', label: '计划状态', options: statusOption, attrs: {placeholder: '请选择计划状态', clearable: true}}
])

const queryData = reactive<Partial<Schedule>>({
  name: '',
  date: [],
  finished: 2
})

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'name', label: '名称' } },
  { attrs: { prop: 'description', label: '描述' } },
  { attrs: { prop: 'date', label: '所需时间', width: 240} },
  { attrs: { prop: 'finished', label: '计划状态', width: 120 }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 150 }, _slot: true },
])

const list = ref<Array<Schedule>>([
  {id: '12132', name: '111', description: '111', finished: 0, date: ['2022-02-15', '2022-02-20']}
])

const show = ref<boolean>(false)
const title = ref<string>('')

const schduleConfigs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '计划名称', attrs: {placeholder: '请输入计划名称', clearable: true}},
  {name: 'date-picker', prop: 'date', label: '所需时间', attrs: { type: 'daterange', rangeSeparator: '-',startPlaceholder: '开始日期', endPlaceholder: '截止日期'}},
  {name: 'select', prop: 'finished', label: '计划状态', options: statusOption.slice(0,2), attrs: {placeholder: '请选择计划状态', clearable: true}},
  {name: 'input', prop: 'description', label: '描述', attrs: {type: 'textarea', placeholder: '请输入计划描述'}}
])

const scheduleInfo = reactive<Schedule>({
  name: '',
  date: [],
  finished: 0,
  description: ''
})

function createSchdule() {
  show.value = true
  title.value = '添加计划'
}

function edit(row: Schedule) {
  title.value = '计划详情 - ' + row.name
  show.value = true
  Object.assign(scheduleInfo, row)
}

function toggleStatus (row: Schedule) {
  row.finished = row.finished === 0 ? 1 : 0
}

function remove(row: Schedule) {
}

function cancel () {
  show.value = false
}

function save () {
  show.value = false
}
</script>