<template>
<div class="project-details-page">
  <h3 class="title">{{isCreate ? '创建项目' : '项目详情'}}</h3>
  <div class="info">
    <Query :configs='configs' :data='queryData' size='small'>
      <el-button>取消</el-button>
      <el-button type='primary'>保存项目</el-button>
    </Query>
  </div>
</div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue-demi'
import {useRoute} from 'vue-router'

import Query from '@/components/query.vue'

const route = useRoute()
const isCreate = ref<boolean>(false)


const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'title', label: '项目名称', attrs: {placeholder: '请输入项目名称', clearable: true} },
  { name: 'input', prop: 'description', label: '项目简介', attrs: {type: 'textarea', placeholder: '请输入项目简介'} },
  { name: 'select', label: '运行状态', prop: 'runing', attrs: {placeholder: '请选择运行状态', clearable: true}, options: [{label: '已暂停', value: 0}, {label: '运行中', value: 1}] }
])
const queryData = reactive<Partial<Project>>({
  name: '',
  description: '',
  runingTime: '',
  runing: 1
})

onMounted(() => {
  console.log(route)
  if (route.params.id === '0') {
    route.meta.title = '创建项目'
    document.title = '创建项目'
    isCreate.value = true
  }
})
</script>