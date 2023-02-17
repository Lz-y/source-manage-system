<template>
  <div class="user-manage-page">
    <Query :configs="configs" :data="formData" inline>
      <el-button type="primary" :icon="Search" @click="loadData"
        >查询</el-button
      >
      <el-button :icon="CirclePlus" @click="addUser">添加用户</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns="columns" :data="list">
      <template #gender="{ row }">
        <span v-if="genderOptions[row.gender]">{{
          genderOptions[row.gender].label
        }}</span>
      </template>
      <template #status="{ row }">
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{
          statusOptions[row.status].label
        }}</span>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" size="small" @click="edit(row)" text
          >修改</el-button
        >
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#fdbc00"
          title="确定删除该用户？"
          @confirm="delUser(row._id)"
        >
          <template #reference>
            <el-button type="danger" size="small" text>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <pagination :total="pageTotal" />
    <el-dialog v-model="show" width="30%" :title="title" top="30vh">
      <el-row align="middle">
        <el-col :md="8" :sm="6" :xs="4">
          <el-upload
            class="avatar-upload"
            action=""
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <img
              :src="curUser.avatar"
              alt="avatar"
              v-if="curUser.avatar"
              class="avatar"
            />
            <el-icon v-else class="avatar-upload-icon">
              <plus />
            </el-icon>
          </el-upload>
        </el-col>
        <el-col :span="16">
          <Query
            ref="userForm$"
            :configs="userConfig"
            :data="curUser"
            label-width="80px"
          ></Query>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserManagePage',
}
</script>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Search, CirclePlus, InfoFilled, Plus } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import pagination from '@/components/pagination.vue'

import { QConfig, ColumnProps, User, KeyMap } from '#/global'
import { getUsers, deleteUser, putUser, getOneDict } from '@/api'

const statusOptions = ref<Array<KeyMap>>([])
const genderOptions = [
  { label: '女', value: 0 },
  { label: '男', value: 1 },
]
const configs = ref<Array<QConfig>>([
  {
    name: 'input',
    label: '用户昵称',
    prop: 'name',
    attrs: { placeholder: '请输入用户账号或昵称', clearable: true },
  },
  {
    name: 'select',
    label: '状态',
    prop: 'status',
    attrs: { placeholder: '请选择用户状态', clearable: true },
    options: [],
  },
])

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '#' } },
  { attrs: { prop: 'account', label: '账号' } },
  { attrs: { prop: 'nickName', label: '昵称' } },
  { attrs: { prop: 'gender', label: '性别' }, _slot: true },
  { attrs: { prop: 'email', label: '邮箱' } },
  { attrs: { prop: 'avatar', abel: '头像' } },
  { attrs: { prop: 'status', label: '状态' }, _slot: true },
  { attrs: { prop: 'createTime', label: '创建时间' } },
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])

const formData = reactive({
  name: null,
  status: null,
})

const list = ref<Array<User>>([])
const pageTotal = ref<number>(0)
const loading = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const show = ref<boolean>(false)
const title = ref<string>()
const userConfig = ref<Array<QConfig>>([
  {
    name: 'input',
    label: '账号',
    prop: 'account',
    attrs: { placeholder: '请输入用户账号', clearable: true, disabled: isEdit },
  },
  {
    name: 'input',
    label: '昵称',
    prop: 'nickName',
    attrs: { placeholder: '请输入用户昵称', clearable: true },
  },
  {
    name: 'select',
    label: '性别',
    prop: 'gender',
    attrs: { placeholder: '请选择用户性别', clearable: true },
    options: genderOptions,
  },
  {
    name: 'input',
    label: '邮箱',
    prop: 'email',
    attrs: { placeholder: '请输入邮箱', clearable: true },
  },
  {
    name: 'select',
    label: '状态',
    prop: 'status',
    attrs: { placeholder: '请选择用户状态', clearable: true },
    options: [],
  },
])
const userForm$ = ref()
const curUser = reactive<User>({
  nickName: '',
  account: '',
  gender: null,
  avatar: '',
  email: '',
  status: 1,
})
function addUser() {
  show.value = true
  isEdit.value = false
  title.value = '添加用户'
}

function edit(row: User) {
  show.value = true
  isEdit.value = true
  title.value = '编辑用户信息'
  Object.assign(curUser, {
    _id: row._id,
    nickName: row.nickName,
    account: row.account,
    avatar: row.avatar,
    gender: row.gender,
    email: row.email,
    status: String(row.status),
  })
}
async function delUser(id: string) {
  try {
    const { msg } = await deleteUser(id)
    ElNotification({
      title: 'success',
      message: msg,
      type: 'success',
      duration: 3000,
    })
    loadData()
  } catch (error) {
    throw error
  }
}

function cancel() {
  show.value = false
  userForm$.value.form$.clearValidate()
  Object.assign(curUser, {
    nickName: '',
    account: '',
    avatar: '',
    gender: null,
    email: '',
    status: '1',
  })
  curUser._id && delete curUser._id
}
async function save() {
  try {
    let res
    if (isEdit.value) {
      res = await putUser(curUser._id!, curUser)
    } else {
      res = await curUser
    }
    ElNotification({
      title: 'success',
      message: res.msg,
      type: 'success',
      duration: 3000,
    })
    loadData()
  } catch (error) {
    throw error
  } finally {
    cancel()
  }
}
function beforeUpload() {}
function uploadSuccess() {}

async function loadData() {
  loading.value = true
  try {
    const {
      result: { data, total },
    } = await getUsers(formData)
    data.forEach((item: User) => {
      item.createTime = dayjs(item.createTime!).format('YYYY-MM-DD HH:mm:ss')
    })
    list.value = data
    pageTotal.value = total
  } catch (error) {
    throw error
  } finally {
    loading.value = false
  }
}
async function getDicts() {
  try {
    const { data } = await getOneDict({ type: 'SYS_STATUS' })
    configs.value[1].options = data
    userConfig.value[4].options = data
    statusOptions.value = data
  } catch (error) {
    throw error
  }
}
async function initData() {
  await getDicts()
  await loadData()
}
onMounted(() => {
  initData()
})
</script>

<style lang="scss">
.user-manage-page {
  .avatar-upload {
    width: 100%;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .el-upload {
      width: 100%;

      &:hover {
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
