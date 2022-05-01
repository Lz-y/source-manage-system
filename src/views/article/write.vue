<template>
  <div class="create-article-page" v-loading="loading">
    <Query :configs="configs" :data="formData" size='small' inline>
      <el-button type="primary" size="mini"  @click="publish">发布</el-button>
    </Query>
    <MarkdownEditor v-model='formData.content'/>
    <el-dialog v-model='visible' title="文章信息" top="25vh" width="35%" :before-close="close" :close-on-click-modal="false">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6">
          <el-upload
            class="img-upload"
            action=""
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload">
            <img :src="formData.img" alt="img" v-if="formData.img" class="img">
            <el-icon v-else class="img-upload-icon"><plus /></el-icon>
          </el-upload>
        </el-col>
        <el-col :xs="20" :sm="18" :md="16">
          <Query ref="publishForm$" :configs='postConfig' :data='formData' :rules='rules' size="small" status-icon></Query>
        </el-col>
      </el-row>
      <template #footer>
        <el-button size='mini' @click="close">关闭</el-button>
        <el-button size='mini' type="primary" :loading="handling" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import MarkdownEditor from '@/components/editor/index.vue'
import {getOneArticle, createArticle, putArticle, getOneDict} from '@/api'
import {QConfig, Article, ResponseData} from '#/global'

const classifyOptions = [{label: 'blog', value: 'blog'}, {label: '笔记', value: 'note'}, {label: '日记', value: 'daily'}]
const configs = ref<Array<QConfig>>([
  {
    name: 'input', label: '标题', prop: 'title',
    attrs: {placeholder: '请输入标题', style: {width: '300px'}, clearable: true}
  },
  {
    name: 'select', label: '分类', prop: 'classify',
    attrs: {placeholder: '请选择分类', clearable: true, defaultFirstOption: true},
    options: classifyOptions,
    events: {change: selectClassify}
  },
])

const formData = reactive<Partial<Article>>({
  img: '',
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

const visible = ref<boolean>(false)
const publishForm$ = ref()
const postConfig = ref<Array<QConfig>>([
  {
    name: 'select', label: '标签', prop: 'tags',
    attrs: {placeholder: '请选择标签', multiple: true, clearable: true, allowCreate: true, filterable: true, reserveKeyword: false, multipleLimit: 3, style: {width: '300px'}},
    options: []
  },
  {
    name: 'switch', label: '是否加密', prop: 'encrypt',
    attrs: {inlinePrompt: true, activeText: '是', inactiveText: '否', activeValue: 0, inactiveValue: 1},
    events: {change: switchEncrypt}
  },
])
const rules = reactive({
  tags: [
    {required: true, message: '请选择标签', trigger: 'blur'},
  ],
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

function selectClassify (val: string) {
  formData.encrypt = val === 'daily' ? 0 : 1
}

function publish () {
  visible.value = true
}

function beforeUpload () {

}

function uploadSuccess () {

}

function switchEncrypt (state: boolean) {
  nextTick(() => {
    if (!state) {
      postConfig.value.push({
        name: 'input',
        prop: 'psw',
        label: '密码',
        attrs: {type: 'password', placeholder: '请输入密码', style: {width: '50%'}}
      })
    } else {
      postConfig.value.pop()
    }
  })
}
function close () {
  visible.value = false
  publishForm$.value.form$.clearValidate()
  Object.assign(formData, {
    title: '',
    classify: '',
    img: '',
    content: '',
    tags: [],
    status: 0,
    encrypt: 1
  })
}
async function confirm () {
  try {
    const valid = await publishForm$.value.form$.validate()
    if (!valid) {
      return false
    }
    handling.value = true
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
async function getDicts () {
  try {
    const {data}= await getOneDict({type: 'SYS_TAGS'})
    postConfig.value[0].options = data
  } catch (error) {
    throw error
  }
}
onMounted(() => {
  getDetailById()
  getDicts()
})
</script>

<style lang="scss">
.create-article-page{
  .img-upload {
    width: 100%;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .el-upload{
      width: 100%;
      &:hover{
        border-color: #409eff;
      }
    }

    &-icon {
      border-radius: 6px;
      border: 1px dashed #d9d9d9;
      font-size: 28px;
      color: #8c939d;
      width: 100%;
      height: 178px;
      line-height: 178px;
      text-align: center;
      box-sizing: border-box;
    }
    .img {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }
  }
}
</style>