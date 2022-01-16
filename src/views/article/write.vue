<template>
  <div class="add-article-page">
    <Query :configs="configs" :data="formData" size='small' inline>
      <el-button type="primary" @click="publish">发布</el-button>
    </Query>
    <MarkdownEditor />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue-demi'

import Query from '@/components/query.vue'
import MarkdownEditor from '@/components/editor/index.vue'

const classifyOptions = [{label: 'blog', value: 0}, {label: '笔记', value: 1}, {label: '日记', value: 2}]
const statusOptions = [{label: '可用', value: 1}, {label: '已失效', value: 0}]
const configs = ref<Array<QConfig>>([
  {
    name: 'input', label: '标题', prop: 'name',
    attrs: {placeholder: '请输入标题', clearable: true}
  },
  {
    name: 'select', label: '分类', prop: 'classify',
    attrs: {placeholder: '请选择分类', clearable: true},
    options: classifyOptions,
    events: {change: selectClassify}
  },
  {
    name: 'select', label: '标签', prop: 'tags',
    attrs: {placeholder: '请选择标签', multiple: true, clearable: true},
    options: statusOptions
  },
  {
    name: 'switch', label: '是否启用', prop: 'status',
    attrs: {inlinePrompt: true, activeText: '是', inactiveText: '否', activeValue: 1, inactiveValue: 0}
  },
  {
    name: 'switch', label: '是否加密', prop: 'encrypt',
    attrs: {inlinePrompt: true, activeText: '是', inactiveText: '否', activeValue: 1, inactiveValue: 0},
    events: {}
  },
])

const formData = reactive<Partial<Article>>({
  title: '',
  classify: '',
  tags: [],
  status: 1,
  encrypt: 0
})

function selectClassify (val: number) {
  formData.encrypt = val === 2 ? 1 : 0
}
function publish () {
  
}
</script>