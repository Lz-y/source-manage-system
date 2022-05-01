<template>
  <div class="logs-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search' size="small">查询</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list'>
      <template #code='{row}'>
        <span :class="row.code === 0 ? 'invalid' : 'available'">{{row.code}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'available' : 'invalid'">{{StatusOptions[row.status].label}}</span>
      </template>
      <template #operation='{row}'>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定使该IP${row.status === 0 ? '加入黑名单' : '移出黑名单'}？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text' size="small">{{row.status === 0 ? '加入黑名单' : '移出黑名单'}}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='pageTotal' />
  </div>
</template>

<script lang="ts">
export default {
  name: 'LogsManagePage'
}
</script>
<script setup lang="ts">
import {ref, reactive, toRaw, onMounted} from 'vue'
import { ElNotification } from 'element-plus'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

import {getLogs, putLog, getOneDict} from '@/api'
import {QConfig, ColumnProps, Logs, KeyMap} from '#/global'

const StatusOptions = ref<Array<KeyMap>>([])
const configs = ref<Array<QConfig>>([
  {
    name: 'select', label: '客户端', prop: 'userAgent',
    attrs: {placeholder: '请选择客户端', clearable: true},
    options: [{label: 'Window', value: 0}, {label: 'Mac', value: 1}]
  },
  {
    name: 'select', label: '请求状态', prop: 'code',
    attrs: {placeholder: '请选择请求状态', clearable: true},
    options: [{label: '200', value: 0}, {label: '401', value: 1}, {label: '403', value: 2},{label: '404', value: 3}, {label: '502', value: 4}, {label: '500', value: 5}]
  },
  {
    name: 'select', label: '状态', prop: 'code',
    attrs: {placeholder: '请选择状态', clearable: true},
    options: []
  }
])
const queryData = reactive({
  userAgent: null,
  status: null,
  code: null
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '#' } },
  { attrs: { prop: 'ip', label: 'IP' } },
  { attrs: { prop: 'userAgent', label: '客户端' } },
  { attrs: { prop: 'url', label: '请求链接' }, _slot: true},
  { attrs: { prop: 'requestTime', label: '时间' } },
  { attrs: { prop: 'code', label: '请求状态', width: 100 }, _slot: true},
  { attrs: { prop: 'status', label: '状态' }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])
const list = ref<Array<Logs>>([])
const pageTotal = ref<number>(0)
const loading = ref<boolean>(false)

async function toggleStatus (row: Logs) {
  try {
    const {msg} = await putLog(row._id, {status: row.status === 0 ? 1: 0})
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
async function getDictStatus () {
  try {
    const {data} = await getOneDict({type: 'SYS_LOG_STATUS'})
    configs.value[2].options = data
    StatusOptions.value = data
  } catch (error) {
    throw error
  }
}
async function loadData() {
  loading.value = true
  try {
    const {result: {data, total}} = await getLogs(queryData)
    data.forEach((item: Logs) => {
      item.requestTime = dayjs(item.requestTime).format('YYYY-MM-DD HH:mm:ss')
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
  getDictStatus()
  loadData()
})
</script>