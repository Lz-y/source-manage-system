<template>
  <div class="resource-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list'>
      <template #img='{row}'>
        <img :src="row.img" />
      </template>
      <template #url='{row}'>
        <a :href="row.url" target="_blank">{{row.url}}</a>
      </template>
      <template #encrypt='{row}'>
        <span :class="row.encrypt === 0 ? 'available' : 'encrypted'">{{row.encrypt === 0 ? '公开' : '已加密'}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{row.status === 0 ? '已失效' : '可用'}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' @click="toggleEncrypt(row)">{{row.encrypt === 0 ? '加密' : '公开'}}</el-button>
        <el-button type='text' @click="toggleStatus(row)">{{row.status === 0 ? '恢复正常' : '失效'}}</el-button>
      </template>
    </CustomTable>
    <Pagination :total='20' />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ResourceManagePage'
}
</script>
<script setup lang="ts">
import {ref, reactive} from 'vue-demi'
import {ElMessageBox} from 'element-plus'
import { Search } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'name', label: '名称', attrs: {placeholder: '请选择资源名称', clearable: true}, },
  {
    name: 'select', label: '加密状态', prop: 'encrypt',
    attrs: {placeholder: '请选择资源加密状态', clearable: true},
    options: [{label: '公开', value: 0}, {label: '已加密', value: 1}]
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择资源状态', clearable: true},
    options: [{label: '已失效', value: 0}, {label: '正常', value: 1}]
  }
])
const queryData = reactive({
  name: null,
  encrypt: null,
  status: null
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'name', label: '名称' } },
  { attrs: { prop: 'img', label: '封面' }, _slot: true },
  { attrs: { prop: 'url', label: '链接' }, _slot: true },
  { attrs: { prop: 'description', label: '描述' } },
  { attrs: { prop: 'encrypt', label: '是否加密' }, _slot: true },
  { attrs: { prop: 'status', label: '资源状态' }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])
const list = ref([
  {name: '111', img: '111', url: '111', description: '111', status: 0, encrypt: 0}
])

async function toggleEncrypt (row: any) {
  try {
    ElMessageBox.prompt('请输入密码', '提示', {
      
    })
  } catch (error) {
    
  }
}
function toggleStatus (row: any) {
}
</script>