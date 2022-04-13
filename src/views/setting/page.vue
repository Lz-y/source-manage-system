<template>
  <div class="dictionary-setting-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button type='primary' :icon='CirclePlus' @click="addDict">新增字典</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list'>
      <template #expand='{row}'>
        <div>{{row.page}}</div>
      </template>
      <template #operation='{row}'>
        <el-button type='text' @click="editDict(row)">编辑</el-button>
        <el-button type='text'>配置</el-button>
      </template>
    </CustomTable>
    <Pagination :total='0' />
    <el-dialog v-model='visible' title="新增字典" width="20%">
      <Query :configs='newConfig' :data='newConfigForm'></Query>
      <template #footer>
        <el-button size='small' @click="close">关闭</el-button>
        <el-button size='small' type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PageSettingManagePage'
}
</script>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Search, InfoFilled, CirclePlus } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'title', label: '字典名称', attrs: {placeholder: '请输入字典名称', clearable: true}, },
])
const queryData = reactive({
  name: null,
  status: null,
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'expand' }, _slot: true},
  { attrs: { prop: 'page', label: '页面' } },
  { attrs: { prop: 'path', label: '路径'} },
  { attrs: { prop: 'redirect', label: '默认显示'} },
  { attrs: { prop: 'title', label: '标题'} },
  { attrs: { prop: 'icon', label: '图标'} },
  { attrs: { prop: 'permission', label: '权限'} },
  { attrs: { prop: 'operation', label: '操作', width: 140 }, _slot: true },
])
const list = ref([
  {page: 'user', path: '/user'}
])

const visible = ref<boolean>(false)
const newConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '字典名称', attrs: {placeholder: '请输入字典名称', clearable: true}},
  {name: 'input', prop: 'type', label: '字典类型', attrs: {placeholder: '请输入字典类型', clearable: true}},
])
const newConfigForm = ref({
  name: '',
  type: ''
})

function addDict () {
  visible.value = true
}
function close () {
  visible.value = false
}
function confirm () {
  visible.value = false
  // list.value.push(newConfigForm.value)
}
function editDict (row: any) {
  visible.value = true
  newConfigForm.value = {...row}
}
function deleteDict (row: any) {
  // list.value = list.value.filter(item => item.type !== row.type)
}
</script>