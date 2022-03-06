<template>
  <div class="add-article-page" v-loading="loading">
    <Query :configs="configs" :data="formData" size='small' inline>
      <el-button type="primary" size="mini" :loading="handling"  @click="publish">保存</el-button>
    </Query>
    <MarkdownEditor v-model='formData.content'/>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { ElMessageBox } from 'element-plus'
import Query from '@/components/query.vue'
import MarkdownEditor from '@/components/editor/index.vue'
import {getOneArticle, createArticle, putArticle} from '@/api'

const classifyOptions = [{label: 'blog', value: 'blog'}, {label: '笔记', value: 'note'}, {label: '日记', value: 'daily'}]
const statusOptions = [{label: 'vue', value: 'vue'}, {label: 'react', value: 'react'}, {label: 'node', value: 'node'}]
const configs = ref<Array<QConfig>>([
  {
    name: 'input', label: '标题', prop: 'title',
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
    name: 'switch', label: '是否已发布', prop: 'status',
    attrs: {inlinePrompt: true, activeText: '是', inactiveText: '否', activeValue: 1, inactiveValue: 0}
  },
  {
    name: 'switch', label: '是否加密', prop: 'encrypt',
    attrs: {inlinePrompt: true, activeText: '是', inactiveText: '否', activeValue: 0, inactiveValue: 1},
    events: {}
  },
])

const formData = reactive<Partial<Article>>({
  title: '',
  classify: '',
  content: '',
  tags: [],
  status: 0,
  encrypt: 1
})
const router = useRouter()
const route = useRoute()
const loading = ref<boolean>(false)
const handling = ref<boolean>(false)

function selectClassify (val: string) {
  formData.encrypt = val === 'daily' ? 0 : 1
}

async function publish () {
  handling.value = true
  try {
    const {id} = route.query
    const isEdit = id ? true : false
    let res: ResponseData
    const params = Object.assign({}, formData)
    delete params._id
    if (isEdit) {
      res = await putArticle(id, params)
    } else {
      res = await createArticle(params)
    }
    handling.value = false
    await ElMessageBox.confirm(res.msg, 'success',{
      type: 'success',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    router.go(-1)
  } catch (error) {
    throw error
  }
}
async function getDetailById() {
  const {id} = route.query
  if (!id) {
    return
  }
  loading.value = true
  try {
    const {data} = await getOneArticle(id)
    Object.assign(formData, data)
  } catch (error) {
    throw error
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  getDetailById()
})
</script>