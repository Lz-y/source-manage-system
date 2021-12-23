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
      <template #classify='{row}'>
        <div class="classify">
          <el-tag v-for="tag in row.classify" size='mini' :key="'tag-' + tag">{{tag}}</el-tag>
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
        <el-button type='text' size='small'>{{row.status === 0 ? '恢复正常' : '失效'}}</el-button>
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
import { Search } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  {
    name: 'input', label: '标题', prop: 'name',
    attrs: {placeholder: '请输入文章标题', clearable: true}
  },
  {
    name: 'select', label: '类别', prop: 'classify',
    attrs: {placeholder: '请选择文章类别', clearable: true},
    options: [{label: 'vue', value: 0}, {label: 'node.js', value: 1}]
  },
  {
    name: 'select', label: '加密状态', prop: 'encrypt',
    attrs: {placeholder: '请选择文章加密状态', clearable: true},
    options: [{label: '未加密', value: 0}, {label: '已加密', value: 1}]
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择文章状态', clearable: true},
    options: [{label: '已失效', value: 0}, {label: '正常', value: 1}]
  }
])

const columns = ref<Array<ColumnProps>>([
  {
    attrs: {
      type: 'index',
      label: '序号'
    }
  },
  {
    attrs: {
      prop: 'url',
      label: '封面',
    },
    _slot: true
  },
  {
    attrs: {
      prop: 'title',
      label: '标题',
    }
  },
  {
    attrs: {
      prop: 'classify',
      label: '类别'
    },
    _slot: true
  },
  {
    attrs: {
      prop: 'createTime',
      label: '发布时间'
    }
  },
  {
    attrs: {
      prop: 'pv',
      label: '浏览数'
    }
  },
  {
    attrs: {
      prop: 'commentary',
      label: '评论数'
    }
  },
  {
    attrs: {
      prop: 'encrypt',
      label: '加密状态'
    },
    _slot: true
  },
  {
    attrs: {
      prop: 'status',
      label: '状态'
    },
    _slot: true
  },
  {
    attrs: {
      prop: 'operation',
      label: '操作'
    },
    _slot: true
  }
])

const formData = reactive({
  name: '',
  classify: null,
  encrypt: null,
  status: null
})

const tableData = ref([
  {url: '', title: 'Vue3 的使用', classify: ['Vue', 'Pinia', 'Vue-Router 4.0'], createTime: '2021-12-22 23:38:45', pv: 100, commentary: 100, encrypt: 0, status: 1},
])
</script>

<style lang="scss">
.classify {
  & > :not(:last-child){
    margin-right: 5px;
  }
}
</style>