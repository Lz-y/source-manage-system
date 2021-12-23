<template>
  <div class="resource-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline></Query>
    <CustomTable :columns='columns' :data='list'>
      <template #img='{row}'>
        <img :src="row.img" />
      </template>
      <template #url='{row}'>
        <a :href="row.url" target="_blank">{{row.url}}</a>
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
import {} from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'name', label: '名称' },
])
const queryData = reactive({})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'selection'} },
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'name', label: '名称' } },
  { attrs: { prop: 'img', label: '封面' }, _slot: true },
  { attrs: { prop: 'url', label: '链接' }, _slot: true },
  { attrs: { prop: 'description', label: '描述' } },
  { attrs: { prop: 'encrypt', label: '是否加密' } },
  { attrs: { prop: 'status', label: '资源状态' } },
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