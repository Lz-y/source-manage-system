<template>
  <div class="resource-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button :icon='CirclePlus' @click="modifyResource(0)">添加资源</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list'>
      <template #name='{row}'>
        <a :href="row.link" target="_blank">{{row.name}}</a>
      </template>
      <template #img='{row}'>
        <img :src="row.img" />
      </template>
      <template #classify='{row}'>
        <el-tag size='mini'>{{row.classify}}</el-tag>
      </template>
      <template #encrypt='{row}'>
        <span :class="row.encrypt === 1 ? 'available' : 'encrypted'">{{EncryptStatusOptions[row.encrypt].label}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{StatusOptions[row.status].label}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' size="small" @click="modifyResource(1, row)">编辑</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          title="确认删除该资源？"
          @confirm='delResource(row._id)'>
          <template #reference>
            <el-button type='text' size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='pageTotal' />
    <el-dialog v-model="showEditDialog" title="添加资源" width="35%" top="25vh" :close-on-click-modal="false">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6">
          <el-upload
            class="avatar-upload"
            action=""
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload">
            <img :src="resource.img" alt="avatar" v-if="resource.img" class="avatar">
            <el-icon v-else class="avatar-upload-icon"><plus /></el-icon>
          </el-upload>
        </el-col>
        <el-col :xs="20" :sm="18" :md="16">
          <Query ref="resourceForm$" :configs="editConfig" :data="resource" :rules="editRules" label-width="80px" size="small" status-icon></Query>
        </el-col>
      </el-row>
      <template #footer>
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ResourceManagePage'
}
</script>
<script setup lang="ts">
import {ref, reactive, nextTick, onMounted} from 'vue'
import { Search, CirclePlus, InfoFilled, Plus } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

import {getResources, putResource, createResource, deleteResource, getOneDict} from '@/api'
import {QConfig, ColumnProps, KeyMap, ResourceFile} from '#/global'

const StatusOptions = ref<Array<KeyMap>>([])
const EncryptStatusOptions = ref<Array<KeyMap>>([])
const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'name', label: '名称', attrs: {placeholder: '请输入资源名称', clearable: true}, },
  {
    name: 'select', label: '加密状态', prop: 'encrypt',
    attrs: {placeholder: '请选择资源加密状态', clearable: true},
    options: []
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择资源状态', clearable: true},
    options: []
  }
])
const queryData = reactive({
  name: null,
  encrypt: null,
  status: null
})

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '#' } },
  { attrs: { prop: 'name', label: '名称' }, _slot: true },
  { attrs: { prop: 'img', label: '封面' }, _slot: true },
  { attrs: { prop: 'classify', label: '所属类别' }, _slot: true },
  { attrs: { prop: 'summary', label: '简介' } },
  { attrs: { prop: 'encrypt', label: '是否加密', width: 100 }, _slot: true },
  { attrs: { prop: 'status', label: '资源状态', width: 100 }, _slot: true},
  { attrs: { prop: 'createTime', label: '创建时间' }},
  { attrs: { prop: 'operation', label: '操作', width: 160 }, _slot: true },
])
const list = ref<Array<ResourceFile>>([])
const pageTotal = ref<number>(0)
const loading = ref<boolean>(false)

const showEditDialog = ref<boolean>(false)
const resource = reactive<ResourceFile>({
  name: '',
  img: '',
  classify: '',
  summary: '',
  link: '',
  status: '1',
  encrypt: 1
})
const isEdit = ref<boolean>(false)
const resourceForm$ = ref()
const editRules = reactive({
  name: [{required: true, message: '请输入资源名称', trigger: 'blur'}],
  classify: [{required: true, message: '请选择分类', trigger: 'blur'}],
  psw: [
    {required: true, message: '请输入文件加密密码', trigger: 'blur'},
    {validator: validatorPsw, trigger: ['change', 'blur']},
  ]
})
const editConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '名称', attrs: {placeholder: '请填写资源名称', clearable: true}},
  {name: 'input', prop: 'link', label: '链接', attrs: {placeholder: '请填写链接', clearable: true}},
  {name: 'select', prop: 'classify', label: '分类', attrs: {placeholder: '请选择资源分类'}, options: []},
  {name: 'input', prop: 'summary', label: '简介', attrs: {type: 'textarea', placeholder: '请输入简介'}},
  {name: 'select', prop: 'status', label: '状态', attrs: {placeholder: '请选择资源状态', clearable: true}, options: []},
  {name: 'switch', prop: 'encrypt', label: '是否加密', attrs: {'active-value': 0, 'inactive-value': 1, 'active-text': '是', 'inactive-text': '否', 'inline-prompt': true}, events: {change: switchEncrypt}}
])

function validatorPsw (rule: any, value: string, callback: Function) {
  if (!/^[a-zA-Z0-9\.@#]{6,10}$/g.test(value)) {
    callback(new Error('仅能输入4-8位大小写字母、数字和.#@'))
  } else {
    callback()
  }
}
function modifyResource(type: 0 | 1, row?: ResourceFile) {
  showEditDialog.value = true
  if (type === 1) {
    isEdit.value = true
    Object.assign(resource, {
      _id: row?._id,
      name: row?.name,
      img: row?.img,
      classify: row?.classify,
      summary: row?.summary,
      link: row?.link,
      status: row?.status + '',
      encrypt: row?.encrypt
    })
    if (row?.encrypt === 0) {
      editConfig.value.push({
        name: 'input',
        prop: 'psw',
        label: '密码',
        attrs: {type: 'password', placeholder: '请输入密码'}
      })
    }
  }
}
async function delResource(id: string){
  try {
    const {msg} = await deleteResource(id)
    ElNotification({
      title: 'success',
      message: msg,
      type: 'success',
      duration: 3000
    })
    loadData()
  } catch (error) {
    throw error
  }
}
function beforeUpload () {

}

function uploadSuccess () {

}

function switchEncrypt (state: boolean) {
  nextTick(() => {
    if (!state) {
      editConfig.value.push({
        name: 'input',
        prop: 'psw',
        label: '密码',
        attrs: {type: 'password', placeholder: '请输入密码'}
      })
    } else {
      editConfig.value.pop()
    }
  })
}

function cancel () {
  resourceForm$.value.form$.clearValidate()
  Object.assign(resource, {
    name: '',
    img: '',
    classify: '',
    summary: '',
    link: '',
    status: '1',
    encrypt: 1
  })
  resource._id && delete resource._id
  showEditDialog.value = false
  isEdit.value = false
}

async function save () {
  try {
    let res
    const valid = await resourceForm$.value.form$.validate()
    if (!valid) {
      return false
    }
    if (isEdit.value) {
      res = await putResource(resource._id, resource)
    } else {
      res = await createResource(resource)
    }
    ElNotification({
      title: 'success',
      message: res.msg,
      type: 'success',
      duration: 3000
    })
    loadData()
    cancel()
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getDicts () {
  try {
    const [encryptStatus, resourceStatus, tags] = await Promise.all([getOneDict({type: 'SYS_ENCRYPT_STATUS'}), getOneDict({type: 'SYS_RESOURCE_STATUS'}), getOneDict({type: 'SYS_TAGS'})])
    configs.value[1].options = encryptStatus.data
    configs.value[2].options = resourceStatus.data
    editConfig.value[2].options = tags.data
    editConfig.value[4].options = resourceStatus.data
    StatusOptions.value = resourceStatus.data
    EncryptStatusOptions.value = encryptStatus.data
  } catch (error) {
    throw error
  }
}
async function loadData() {
  loading.value = true
  try {
    const {result: {data, total}} = await getResources(queryData)
    data.forEach((item: ResourceFile) => {
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
    })
    list.value = data
    pageTotal.value = total
  } catch (error) {
    throw error
  } finally {
    loading.value = false
  }
}
async function initData () {
  await getDicts()
  await loadData()
}
onMounted(() => {
  initData()
})
</script>

<style lang="scss">
.resource-manage-page{
  .avatar-upload {
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
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }
  }
}
</style>