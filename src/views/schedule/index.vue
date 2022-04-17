<template>
  <div class="schedule-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button :icon='CirclePlus' @click="createSchdule">添加计划</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list'>
      <template #status='{row}'>
        <span :class="statusOption[row.status].color">{{statusOption[row.status].label}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type="text" size="small" @click="edit(row)">编辑</el-button>
        <el-dropdown style="margin: 0 5px;" @command="(c) => toggleStatus(c, row)">
          <el-button type="text" size="small">切换状态</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in statusOption" :disabled="item.value === row.status" :command="item.value">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="text" size="small" @click="remove(row._id)">删除</el-button>
      </template>
    </CustomTable>
    <Pagination :total='20' />
    <el-dialog v-model="show" :title="title" width="30%">
      <Query ref="scheduleForm$" :configs='schduleConfigs' :data='scheduleInfo' size='small' :label-width="100" style="max-width: 40vw;">
      </Query>
      <template #footer>
        <el-button size="small" @click.prevent="cancel">取消</el-button>
        <el-button type='primary' size="small" @click.prevent="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ScheduleManagePage'
}
</script>
<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import { Search, CirclePlus } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'
import {getSchedules, putSchedule, createSchedule, deleteSchedule} from '@/api'

const statusOption = [{label: '未开始', value: 0, color: 'invalid'}, {label: '进行中', value: 1, color: 'encrypted'}, {label: '已完成', value: 2, color: 'available'}]

const configs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '计划名称', attrs: {placeholder: '请输入计划名称', clearable: true}},
  {name: 'date-picker', prop: 'spend', label: '所需时间', attrs: {type: 'daterange', rangeSeparator: '-',startPlaceholder: '开始日期', endPlaceholder: '截止日期'}},
  {name: 'select', prop: 'status', label: '计划状态', options: statusOption, attrs: {placeholder: '请选择计划状态', clearable: true}}
])

const queryData = reactive<Partial<Schedule>>({
  name: '',
  spend: [],
  status: null
})

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'name', label: '名称' } },
  { attrs: { prop: 'summary', label: '描述' } },
  { attrs: { prop: 'spend', label: '所需时间', width: 240} },
  { attrs: { prop: 'createTime', label: '创建时间', width: 180} },
  { attrs: { prop: 'status', label: '计划状态', width: 90 }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 140 }, _slot: true },
])

const list = ref<Array<Schedule>>([])
const pageTotal = ref<number>(0)
const loading = ref<boolean>(false)

const show = ref<boolean>(false)
const title = ref<string>('')

const schduleConfigs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '计划名称', attrs: {placeholder: '请输入计划名称', clearable: true}},
  {name: 'date-picker', prop: 'spend', label: '所需时间', attrs: { type: 'daterange', rangeSeparator: '-',startPlaceholder: '开始日期', endPlaceholder: '截止日期', valueFormat: 'YYYY-MM-DD'}},
  {name: 'select', prop: 'status', label: '计划状态', options: statusOption, attrs: {placeholder: '请选择计划状态', clearable: true}},
  {name: 'input', prop: 'summary', label: '描述', attrs: {type: 'textarea', placeholder: '请输入计划描述'}}
])

const scheduleInfo = reactive<Schedule>({
  name: '',
  spend: [],
  status: 0,
  summary: ''
})
const scheduleForm$ = ref()
const isEdit = ref<boolean>(false)

function createSchdule() {
  show.value = true
  title.value = '添加计划'
}

function edit(row: Schedule) {
  title.value = '计划详情 - ' + row.name
  show.value = true
  isEdit.value = true
  Object.assign(scheduleInfo, row)
}

async function toggleStatus (command: 0 | 1 | 2, row: Schedule) {
   try{
    const {msg} = await putSchedule(row._id, {status: command})
    ElNotification({
      title: 'success',
      message: msg,
      type: 'success',
      duration: 3000
    })
    loadData()
  } catch (error) {
    throw error
  }
}

async function remove(id: string) {
  try{
    const {msg} = await deleteSchedule(id)
    ElNotification({
      title: 'success',
      message: msg,
      type: 'success',
      duration: 3000
    })
    loadData()
  } catch (error) {
    throw error
  }
}

function cancel () {
  show.value = false
  isEdit.value = false
  scheduleForm$.value.form$.clearValidate()
  Object.assign(scheduleInfo, {
    name: '',
    spend: [],
    status: 0,
    summary: ''
  })
  scheduleInfo._id && delete scheduleInfo._id
  scheduleInfo.createTime && delete scheduleInfo.createTime
}

async function save () {
  try {
    let res
    if (isEdit.value) {
      const params: Omit<Schedule, '_id' | 'createTIme'> = {
        name: scheduleInfo.name,
        summary: scheduleInfo.summary,
        spend: scheduleInfo.spend,
        status: scheduleInfo.status
      }
      res = await putSchedule(scheduleInfo._id, params)
    } else {
      res = await createSchedule(scheduleInfo)
    }
    ElNotification({
      title: 'success',
      message: res.msg,
      type: 'success',
      duration: 3000
    })
    loadData()
  } catch (error) {
    throw error
  } finally {
    cancel()
  }
}
async function loadData() {
  loading.value = true
  try {
    const {result: {data, total}} = await getSchedules(queryData)
    data.forEach((item: Schedule) => {
      item.spend = item.spend.map(item => dayjs(item).format('YYYY-MM-DD'))
      item.createTime = dayjs(item.createTime!).format('YYYY-MM-DD HH:mm:ss')
    })
    list.value = data
    pageTotal.value = total
  } catch (error) {
    throw error
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  loadData()
})
</script>