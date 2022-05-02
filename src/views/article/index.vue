<template>
  <div class="article-manage-page" v-loading="loading">
    <Query :configs="configs" :data="formData" size='small' inline>
      <el-button type='primary' :icon='Search' @click="getAllArticle">查询</el-button>
      <el-button>导出文章数据</el-button>
    </Query>
    <CustomTable :columns="columns" :data='tableData' stripe>
      <template #url='{row}'>
        <img :src="row.url" alt="文章封面">
      </template>
      <template #tags='{row}'>
        <div class="tags">
          <el-tag v-for="tag in row.tags" size='mini' :key="'tag-' + tag">{{tag}}</el-tag>
        </div>
      </template>
      <template #encrypt='{row}'>
        <span :class="row.encrypt === 1 ? 'available' : 'encrypted'">{{EncryptStatusOptions[row.encrypt].label}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'no-reply' : 'available'">{{StatusOptions[row.status].label}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' size='small' @click="showEncryptDislog(row)">{{row.encrypt === 0 ? '公开' : '加密'}}</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定${row.status === 0 ? '发布' : '下架'}该文章？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text' size='small'>{{row.status === 0 ? '发布' : '下架'}}</el-button>
          </template>
        </el-popconfirm>
        <el-button type='text' size='small' @click="jumpTo(row)">编辑</el-button>
      </template>
    </CustomTable>
    <pagination :total="pageTotal" />
    <el-dialog v-model='visible' title="请输入文章密码" width="20%" :before-close="close">
      <Query ref="encryptForm$" :configs='encryptConfig' :data='encryptForm' :rules='rules' size="small" status-icon></Query>
      <template #footer>
        <el-button size='mini' @click="close">关闭</el-button>
        <el-button size='mini' type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ArticleManagePage'
}
</script>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import {ElNotification} from 'element-plus'
import dayjs from 'dayjs'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import pagination from '@/components/pagination.vue'

import {QConfig, ColumnProps, Article, KeyMap} from '#/global'
import {getArticles, putArticle, getOneDict} from '@/api'

const router = useRouter()
const classifyOptions = [{label: 'blog', value: 'blog'}, {label: '笔记', value: 'note'}, {label: '日记', value: 'daily'}]
const StatusOptions = ref<Array<KeyMap>>([])
const EncryptStatusOptions = ref<Array<KeyMap>>([])
const configs = ref<Array<QConfig>>([
  {
    name: 'input', label: '标题', prop: 'title',
    attrs: {placeholder: '请输入标题', clearable: true}
  },
  {
    name: 'select', label: '分类', prop: 'classify',
    attrs: {placeholder: '请选择分类', clearable: true},
    options: classifyOptions,
    events: {change: getAllArticle}
  },
  {
    name: 'select', label: '标签', prop: 'tags',
    attrs: {placeholder: '请选择标签', clearable: true, multiple: true, multipleLimit: 2},
    options: [],
    events: {change: getAllArticle}
  },
  {
    name: 'select', label: '加密状态', prop: 'encrypt',
    attrs: {placeholder: '请选择加密状态', clearable: true},
    options: [],
    events: {change: getAllArticle}
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择状态', clearable: true},
    options: [],
    events: {change: getAllArticle}
  }
])

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '#' } },
  { attrs: { prop: 'url', label: '封面', }, _slot: true },
  { attrs: { prop: 'title', label: '标题', } },
  { attrs: { prop: 'classify', label: '类别', width: 50}},
  { attrs: { prop: 'tags', label: '标签' }, _slot: true },
  { attrs: { prop: 'createTime', label: '创建时间' } },
  { attrs: { prop: 'publishTime', label: '发布时间' } },
  { attrs: { prop: 'viewNum', label: '浏览数', width: 100 } },
  { attrs: { prop: 'commentNum', label: '评论数', width: 100 } },
  { attrs: { prop: 'likeNum', label: '点赞数', width: 100 } },
  { attrs: { prop: 'encrypt', label: '加密状态', width: 80 }, _slot: true },
  { attrs: { prop: 'status', label: '状态', width: 80 }, _slot: true },
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true }
])

const formData = reactive<Partial<Article>>({
  classify: 'blog',
  tags: []
})
const visible = ref<boolean>(false)
const encryptConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'psw', label: '密码', attrs: {type: 'password', showPassword: true, placeholder: '请输入文章密码', tabindex: 1}}
])
const encryptForm = reactive({
  id: null,
  encrypt: null,
  psw: null
})
const encryptForm$ = ref()
const rules = reactive({
  psw: [
    {required: true, message: '请输入文章密码', trigger: 'blur'},
    {validator: validatorPsw, trigger: ['change', 'blur']},
  ]
})
function validatorPsw (rule: any, value: string, callback: Function) {
  if (!/^[a-zA-Z0-9\.@#]{6,10}$/g.test(value)) {
    callback(new Error('仅能输入6-10位大小写字母、数字和.#@'))
  } else {
    callback()
  }
}
const tableData = ref<Array<Article>>([])
const loading = ref<boolean>(false)
const pageTotal = ref<number>(0)

async function toggleStatus (row: Article) {
  await modifyArticle(row._id, {status: row.status === 0 ? 1 : 0}, `该文章${row.status === 0 ? '发布' : '下架'}成功`)
}
function showEncryptDislog (row: Article) {
  visible.value = true
  encryptForm.id = row._id
  encryptForm.encrypt = row.encrypt === 0 ? 1 : 0 as any
}
function close () {
  encryptForm$.value.form$.clearValidate()
  Object.assign(encryptForm, {id: null, psw: null, encrypt: null})
  visible.value = false
}
async function confirm () {
  try {
    const valid = await encryptForm$.value.form$.validate()
    if (!valid) {
     return false
    }
    await modifyArticle(encryptForm.id, {psw: encryptForm.psw!, encrypt: encryptForm.encrypt!}, `${encryptForm.encrypt! === 0 ? '加密' : '公开'}成功`)
  } catch (error) {
    throw error
  } finally {
    close()
  }
}
function jumpTo (row: Article) {
  router.push({name: 'write', query: {id: row._id}})
}

async function getAllArticle () {
  loading.value = true
  try {
    const {title, classify, tags, encrypt, status} = formData
    const params: Partial<Pick<Article, 'title' | 'classify' | 'tags' | 'encrypt' | 'status'>> = {title, classify, encrypt, status}
    
    if (tags!.length > 0) {
      params['tags'] = tags!.join() as any
    }
    const {result: {data, total}} = await getArticles(params)
    data.forEach((item: Article) => {
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
    })
    tableData.value = data
    pageTotal.value = total
  } catch (error) {
   throw error 
  } finally {
    loading.value = false
  }
}
async function modifyArticle (id: any, data: Partial<Article>, message: string) {
  try {
    await putArticle(id, data)
    ElNotification({
      title: 'success',
      message,
      type: 'success',
      duration: 3000
    })
    getAllArticle()
  } catch (error) {
    throw error
  }
}
async function getDicts () {
  try {
    const [tags, encryptStatus, articleStatus] = await Promise.all([getOneDict({type: 'SYS_TAGS'}), getOneDict({type: 'SYS_ENCRYPT_STATUS'}), getOneDict({type: 'SYS_POST_STATUS'})])
    configs.value[2].options = tags.data
    configs.value[3].options = encryptStatus.data
    configs.value[4].options = articleStatus.data
    StatusOptions.value = articleStatus.data
    EncryptStatusOptions.value = encryptStatus.data
  } catch (error) {
    throw error
  }
}
async function initData() {
  await getDicts()
  await getAllArticle()
}
onMounted (() => {
  initData()
})
</script>

<style lang="scss">
.tags {
  & > :not(:last-child){
    margin-right: 5px;
  }
}
</style>