<template>
  <div class="schedule-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button :icon='CirclePlus' @click="createSchdule">添加计划</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list'>
      <template #spend="{row}">
        <span>{{row.relativeTime}}(从 {{row.spend[0]}} 开始)</span>
      </template>
      <template #status='{row}'>
        <span v-if="row.status === 2" class="available">{{statusOption[row.status].label}}</span>
        <span v-else-if="row.status === 1" class="encrypted">{{statusOption[row.status].label}}</span>
        <span v-else class="invalid">{{statusOption[row.status].label}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type="text" size="small" @click="edit(row)">编辑</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          title="确认删除该计划？"
          @confirm='remove(row._id)'>
          <template #reference>
            <el-button type='text' size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='pageTotal' />
    <el-dialog v-model="show" :title="title" width="30%" top="25vh" :close-on-click-modal="false">
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
import { Search, CirclePlus, InfoFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

import {QConfig, ColumnProps, Schedule, KeyMap} from '#/global'
import {getSchedules, putSchedule, createSchedule, deleteSchedule, getOneDict} from '@/api'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const statusOption = ref<Array<KeyMap>>([])

const configs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '计划名称', attrs: {placeholder: '请输入计划名称', clearable: true}},
  {name: 'date-picker', prop: 'spend', label: '所需时间', attrs: {type: 'daterange', rangeSeparator: '-',startPlaceholder: '开始日期', endPlaceholder: '截止日期'}},
  {name: 'select', prop: 'status', label: '计划状态', options: [], attrs: {placeholder: '请选择计划状态', clearable: true}}
])

const queryData = reactive({
  name: null,
  spend: [],
  status: null
})

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '#' } },
  { attrs: { prop: 'name', label: '名称' } },
  { attrs: { prop: 'sequence', label: '优先级', width: 80 } },
  { attrs: { prop: 'summary', label: '描述' } },
  { attrs: { prop: 'spend', label: '所需时间', width: 200}, _slot: true },
  { attrs: { prop: 'createTime', label: '创建时间', width: 170} },
  { attrs: { prop: 'status', label: '计划状态', width: 90 }, _slot: true },
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])

const list = ref<Array<Schedule>>([])
const pageTotal = ref<number>(0)
const loading = ref<boolean>(false)

const show = ref<boolean>(false)
const title = ref<string>('')

const schduleConfigs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '计划名称', attrs: {placeholder: '请输入计划名称', clearable: true}},
  {name: 'date-picker', prop: 'spend', label: '所需时间', attrs: { type: 'daterange', rangeSeparator: '-',startPlaceholder: '开始日期', endPlaceholder: '截止日期', valueFormat: 'YYYY-MM-DD'}},
  {name: 'input-number', prop: 'sequence', label: '优先级', attrs: {precision: 0, step: 1, min: 0, 'controls-position': 'right'}},
  {name: 'select', prop: 'status', label: '计划状态', options: [], attrs: {placeholder: '请选择计划状态', clearable: true}},
  {name: 'input', prop: 'summary', label: '描述', attrs: {type: 'textarea', placeholder: '请输入计划描述'}}
])

const scheduleInfo = reactive<Schedule>({
  name: '',
  spend: [],
  sequence: 0,
  status: '0',
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
  Object.assign(scheduleInfo, {
    _id: row._id,
    name: row.name,
    spend: row.spend,
    sequence: row.sequence,
    status: row.status + '',
    summary: row.summary
  })
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
    status: '0',
    sequence: 0,
    summary: ''
  })
  scheduleInfo._id && delete scheduleInfo._id
}

async function save () {
  try {
    let res
    if (isEdit.value) {
      const params: Omit<Schedule, '_id' | 'createTIme'> = {
        name: scheduleInfo.name,
        summary: scheduleInfo.summary,
        spend: scheduleInfo.spend,
        status: scheduleInfo.status,
        sequence: scheduleInfo.sequence
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
      item.relativeTime = dayjs(item.spend[0]).to(item.spend[1], true)
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
async function getDicts () {
  try {
    const {data}= await getOneDict({type: 'SYS_SCHEDULE_STATUS'})
    configs.value[2].options = data
    schduleConfigs.value[3].options = data
    statusOption.value = data
  } catch (error) {
    throw error
  }
}
async function initData() {
  await getDicts()
  await loadData()
}
onMounted(() => {
  initData()
})
</script>