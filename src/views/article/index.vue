<template>
  <div class="article-manage-page">
    <Query :configs="configs" :data="formData" size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button type='primary'>导出文章数据</el-button>
    </Query>
    <CustomTable :columns="columns" :data='tableData'>
      <template #url='{row}'>
        <img :src="row.url" alt="文章封面">
      </template>
      <template #tags='{row}'>
        <div class="tags">
          <el-tag v-for="tag in row.tags" size='mini' :key="'tag-' + tag">{{tag}}</el-tag>
        </div>
      </template>
      <template #encrypt='{row}'>
        <span :class="row.encrypt === 0 ? 'available' : 'encrypted'">{{row.encrypt === 0 ? '公开' : '已加密'}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{row.status === 0 ? '已失效' : '可用'}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' size='small'>{{row.encrypt === 0 ? '加密' : '公开'}}</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定${row.status === 0 ? '启用' : '禁用'}该文章？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text' size='small'>{{row.status === 0 ? '启用' : '禁用'}}</el-button>
          </template>
        </el-popconfirm>
        <el-button type='text' size='small'>编辑</el-button>
      </template>
    </CustomTable>
    <pagination :total="10" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ArticleManagePage'
}
</script>
<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { Search, InfoFilled } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  {
    name: 'input', label: '标题', prop: 'name',
    attrs: {placeholder: '请输入标题', clearable: true}
  },
  {
    name: 'select', label: '分类', prop: 'classify',
    attrs: {placeholder: '请选择分类', clearable: true},
    options: [{label: 'blog', value: 0}, {label: '笔记', value: 1}, {label: '日记', value: 2}]
  },
  {
    name: 'select', label: '标签', prop: 'tags',
    attrs: {placeholder: '请选择标签', clearable: true, multiple: true, multipleLimit: 2},
    options: [{label: 'vue', value: 0}, {label: 'node.js', value: 1}, {label: 'python', value: 2}]
  },
  {
    name: 'select', label: '加密状态', prop: 'encrypt',
    attrs: {placeholder: '请选择加密状态', clearable: true},
    options: [{label: '未加密', value: 0}, {label: '已加密', value: 1}]
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择状态', clearable: true},
    options: [{label: '已失效', value: 0}, {label: '正常', value: 1}]
  }
])

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'url', label: '封面', }, _slot: true },
  { attrs: { prop: 'title', label: '标题', } },
  { attrs: { prop: 'classify', label: '类别', width: 80}},
  { attrs: { prop: 'tags', label: '标签' }, _slot: true },
  { attrs: { prop: 'createTime', label: '发布时间' } },
  { attrs: { prop: 'pv', label: '浏览数' } },
  { attrs: { prop: 'commentary', label: '评论数' } },
  { attrs: { prop: 'encrypt', label: '加密状态', width: 80 }, _slot: true },
  { attrs: { prop: 'status', label: '状态', width: 80 }, _slot: true },
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true }
])

const formData = reactive({
  name: '',
  classify: 0,
  tags: null,
  encrypt: null,
  status: null
})

const tableData = ref<Array<Article>>([
  {url: '', title: 'Vue3 的使用', classify: 'blog', tags: ['Vue', 'Pinia', 'Vue-Router 4.0'], createTime: '2021-12-22 23:38:45', pv: 100, commentary: 100, encrypt: 0, status: 1},
])
function toggleStatus (row: ResourceFile) {
  row.status = row.status === 0 ? 1 : 0
}
</script>

<style lang="scss">
.tags {
  & > :not(:last-child){
    margin-right: 5px;
  }
}
</style>