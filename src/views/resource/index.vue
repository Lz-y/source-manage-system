<template>
  <div class="resource-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button :icon='CirclePlus' @click="addResource">添加资源</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list'>
      <template #img='{row}'>
        <img :src="row.img" />
      </template>
      <template #url='{row}'>
        <a :href="row.url" target="_blank">{{row.url}}</a>
      </template>
      <template #classify='{row}'>
        <el-tag size='mini'>{{row.classify}}</el-tag>
      </template>
      <template #encrypt='{row}'>
        <span :class="row.encrypt === 0 ? 'available' : 'encrypted'">{{row.encrypt === 0 ? '公开' : '已加密'}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{row.status === 0 ? '已失效' : '可用'}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' @click="showEncryptDislog">{{row.encrypt === 0 ? '加密' : '公开'}}</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定使该资源${row.status === 0 ? '可用' : '失效'}？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text'>{{row.status === 0 ? '恢复正常' : '失效'}}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='20' />
    <el-dialog v-model='visible' title="请输入文件密码" width="20%">
      <Query :configs='encryptConfig' :data='encryptForm' :rules='rules'></Query>
      <template #footer>
        <el-button size='small' @click="close">关闭</el-button>
        <el-button size='small' type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showAddResource" title="添加资源" width="35%">
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
          <Query ref="userForm$" :configs="resourceConfig" :data="resource" :rules="createResourceRules" label-width="80px" size="small" status-icon></Query>
        </el-col>
      </el-row>
      <template #footer>
        <el-button size="mini" @click="cancelAdd">取消</el-button>
        <el-button type="primary" size="mini" @click="saveResource">保存</el-button>
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
import {ref, reactive, nextTick} from 'vue'
import { Search, CirclePlus, InfoFilled, Plus } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'name', label: '名称', attrs: {placeholder: '请输入资源名称', clearable: true}, },
  {
    name: 'select', label: '加密状态', prop: 'encrypt',
    attrs: {placeholder: '请选择资源加密状态', clearable: true},
    options: [{label: '公开', value: 0}, {label: '已加密', value: 1}]
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择资源状态', clearable: true},
    options: [{label: '已失效', value: 0}, {label: '正常', value: 1}]
  }
])
const queryData = reactive({
  name: null,
  encrypt: null,
  status: null
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'name', label: '名称' } },
  { attrs: { prop: 'img', label: '封面' }, _slot: true },
  { attrs: { prop: 'url', label: '链接' }, _slot: true },
  { attrs: { prop: 'classify', label: '所属类别' }, _slot: true },
  { attrs: { prop: 'description', label: '简介' } },
  { attrs: { prop: 'encrypt', label: '是否加密' }, _slot: true },
  { attrs: { prop: 'status', label: '资源状态' }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])
const list = ref<Array<ResourceFile>>([
  {name: '111', img: '111', url: '111', classify: 'vue', description: '111', status: 0, encrypt: 0}
])
const visible = ref<boolean>(false)
const encryptConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'encrypt', attrs: {type: 'password', showPassword: true, placeholder: '请输入文件加密密码'}}
])
const encryptForm = reactive({
  encrypt: null
})
const rules = reactive({
  encrypt: [
    {required: true, message: '请输入文件加密密码', trigger: 'blur'},
    {validator: validatorPsw, trigger: ['change', 'blur']},
  ]
})

const showAddResource = ref<boolean>(false)
const resource = reactive<Partial<ResourceFile>>({
  status: 1
})
const createResourceRules = reactive({
  name: [{required: true, message: '请输入资源名称', trigger: 'blur'}],
  classify: [{required: true, message: '请选择分类', trigger: 'blur'}],
})
const resourceConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '名称', attrs: {placeholder: '请输入资源名称', clearable: true}},
  {name: 'select', prop: 'classify', label: '分类', attrs: {placeholder: '请选择资源分类'}},
  {name: 'input', prop: 'description', label: '简介', attrs: {type: 'textarea', placeholder: '请输入简介'}},
  {name: 'switch', prop: 'encrypt', label: '是否加密', attrs: {}, events: {change: switchEncrypt}},
  {name: 'select', prop: 'status', label: '状态', attrs: {placeholder: '请选择资源状态', clearable: true}, options: [{label: '已失效', value: 0}, {label: '正常', value: 1}]}
])
function validatorPsw (rule: any, value: string, callback: Function) {
  if (!/^[a-zA-Z0-9\.@#]{4,8}$/g.test(value)) {
    callback(new Error('仅能输入4-8位大小写字母、数字和.#@'))
  } else {
    callback()
  }
}
function addResource() {
  showAddResource.value = true
}

function beforeUpload () {

}

function uploadSuccess () {

}

function switchEncrypt (state: boolean) {
  nextTick(() => {
    if (state) {
      resourceConfig.value.splice(4, 0, {name: 'input', prop: 'psw', label: '密码', attrs: {type: 'password', placeholder: '请输入密码'}})
      Object.assign(createResourceRules,{psw: [
        {required: true, message: '请输入文件加密密码', trigger: 'blur'},
        {validator: validatorPsw, trigger: ['change', 'blur']},
      ]})
    } else {
      resourceConfig.value.splice(4, 1)
    }
  })
}

function cancelAdd () {
  showAddResource.value = false
}

function saveResource () {
  showAddResource.value = false
}

function showEncryptDislog () {
  visible.value = true
}
function toggleStatus (row: ResourceFile) {
  row.status = row.status === 0 ? 1 : 0
}
function close () {
  visible.value = false
}
function confirm () {
  visible.value = false
}
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