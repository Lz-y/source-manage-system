<template>
  <div class="project-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button :icon='CirclePlus' @click="create">添加项目</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list'>
      <template #img='{row}'>
        <img :src="row.img" style="max-width: 50px;"/>
      </template>
      <template #url='{row}'>
        <a :href="row.url" target="_blank">{{row.url}}</a>
      </template>
      <template #runing='{row}'>
        <el-icon size='18' :color="row.runing === 0 ? '#fdbc00' : '#0ac710'">
          <VideoPause v-if="row.runing === 0"/>
          <VideoPlay v-else />
        </el-icon>
        <span :style="{color: row.runing === 0 ? '#fdbc00' : '#0ac710'}">{{row.runing === 0 ? '已暂停' : '运行中'}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' size="small" @click="edit(row)">编辑</el-button>
        <el-button type='text' size="small" @click="view(row)">详情</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`是否${row.runing === 0 ? '启动' : '暂停'}该项目？`"
          @confirm='toggleRunning(row)'>
          <template #reference>
            <el-button type='text' size="small">{{row.runing === 0 ? '启动' : '暂停'}}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='0' />
  </div>
</template>
<script lang="ts">
export default {
  name: 'ProjectManagePage'
}
</script>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, InfoFilled, CirclePlus, VideoPlay, VideoPause } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const router = useRouter()
const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'title', label: '项目名称', attrs: {placeholder: '请输入项目名称', clearable: true}, },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择状态', clearable: true},
    options: [{label: '已失效', value: 0}, {label: '正常', value: 1}]
  }
])
const queryData = reactive({
  name: null,
  status: null,
})

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'name', label: '项目名称' } },
  { attrs: { prop: 'img', label: '封面', width: 80 }, _slot: true },
  { attrs: { prop: 'description', label: '描述' } },
  { attrs: { prop: 'createTime', label: '创建时间' }, _slot: true },
  { attrs: { prop: 'runingTime', label: '运行时间' }, _slot: true },
  { attrs: { prop: 'runing', label: '运行状态', width: 100 }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 140 }, _slot: true },
])
const list = ref<Array<Project>>([
  {id: '111', name: '111', img: '/src/assets/logo.png', description: '111', createTime: '2021-12-28', runingTime: '0天20小时12分', runing: 1,}
])
const loading = ref<boolean>(false)
function create() {
  router.push({name: 'projectDetail', params: {id: 0}})
}
function edit(row: Project) {
  router.push({name: 'projectDetail', params: {id: row.id}})
}
function view(row: Project) {
  router.push({name: 'projectDetail', params: {id: row.id}})
}
function toggleRunning (row: Project) {
  row.runing = row.runing === 0 ? 1 : 0
}
</script>