<template>
  <div class="logs-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list'>
      <template #code='{row}'>
        <span :class="row.code === 0 ? 'invalid' : 'available'">{{row.code}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{row.status === 0 ? '已加入黑名单' : '未加入黑名单'}}</span>
      </template>
      <template #operation='{row}'>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定使该IP${row.status === 0 ? '移出黑名单' : '加入黑名单'}？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text'>{{row.status === 0 ? '移出黑名单' : '加入黑名单'}}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='20' />
  </div>
</template>

<script lang="ts">
export default {
  name: 'LogsManagePage'
}
</script>
<script setup lang="ts">
import {ref, reactive} from 'vue-demi'
import { Search, InfoFilled } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  {
    name: 'select', label: '客户端', prop: 'agent',
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
    options: [{label: '已加入黑名单', value: 0}, {label: '未加入黑名单', value: 1}]
  }
])
const queryData = reactive({
  name: null,
  status: null,
  code: null
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'ip', label: 'IP' } },
  { attrs: { prop: 'agent', label: '客户端' } },
  { attrs: { prop: 'url', label: '请求链接' }, _slot: true},
  { attrs: { prop: 'time', label: '时间' } },
  { attrs: { prop: 'code', label: '请求状态', width: 100 }, _slot: true},
  { attrs: { prop: 'status', label: '状态' }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])
const list = ref<Array<Logs>>([
  {ip: '192.168.1.30', agent: 'Windows Chrome 96.89.4', time: '2021-12-24 00:37:10', url: '/api/article/1', code: 200, status: 0},
  {ip: '192.168.1.30', agent: 'Windows Chrome 96.89.4', time: '2021-12-24 00:37:10', url: '/api/article/1', code: 401, status: 1},
])

function toggleStatus (row: Logs) {
  row.status = row.status === 0 ? 1: 0
}
</script>