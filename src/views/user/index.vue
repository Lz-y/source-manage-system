<template>
  <div class="user-manage-page">
    <Query :configs="configs" :data="formData" size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button :icon='CirclePlus' @click="addUser">添加用户</el-button>
      <el-button>导出用户数据</el-button>
    </Query>
    <CustomTable :columns="columns" :data='tableData'>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{row.status === 0 ? '已失效' : '可用'}}</span>
      </template>
      <template #operation='{row}'>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定${row.status === 0 ? '启用' : '禁用'}该用户？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text' size='small'>{{row.status === 0 ? '启用' : '禁用'}}</el-button>
          </template>
        </el-popconfirm>
        <el-button type='text' size='small' @click="edit(row)">编辑</el-button>
      </template>
    </CustomTable>
    <pagination :total="10" />
    <el-dialog v-model="show" width="35%" :title="title">
      <el-row>
        <el-col :md="8" :sm="6" :xs="4">
          <el-upload
            class="avatar-upload"
            action=""
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload">
            <img :src="curUser.avatar" alt="avatar" v-if="curUser.avatar" class="avatar">
            <el-icon v-else class="avatar-upload-icon"><plus /></el-icon>
          </el-upload>
        </el-col>
        <el-col :span="16">
          <Query ref="userForm$" :configs="userInfo" :data="curUser" label-width="80px" size="small"></Query>
        </el-col>
      </el-row>
      <template #footer>
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type='primary' size="small" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserManagePage'
}
</script>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Search, CirclePlus, InfoFilled, Plus } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import pagination from '@/components/pagination.vue'

const statusOptions = [{label: '可用', value: 1}, {label: '已失效', value: 0}]
const configs = ref<Array<QConfig>>([
  {
    name: 'input', label: '用户昵称', prop: 'name',
    attrs: {placeholder: '请输入用户账号或昵称', clearable: true}
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择用户状态', clearable: true},
    options: statusOptions
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
      prop: 'account',
      label: '账号',
    }
  },
  {
    attrs: {
      prop: 'nickName',
      label: '昵称'
    }
  },
  {
    attrs: {
      prop: 'email',
      label: '邮箱'
    }
  },
  {
    attrs: {
      prop: 'avatar',
      label: '头像'
    }
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
      label: '操作',
      width: 150
    },
    _slot: true
  }
])

const formData = reactive({
  name: '',
  status: null
})

const tableData = ref<Array<User>>([
  {account: '11', nickName: 'lan', avatar: '6666', email: '1111', status: 0},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 1},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 0},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 1},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 1},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 1},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 1},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 0},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 0},
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 0},
])
const isEdit = ref<boolean>(false)
const show = ref<boolean>(false)
const title = ref<string>()
const userInfo = ref<Array<QConfig>>([
  {
    name: 'input', label: '账号', prop: 'account',
    attrs: {placeholder: '请输入用户账号', clearable: true, disabled: isEdit}
  },
  {
    name: 'input', label: '用户昵称', prop: 'nickName',
    attrs: {placeholder: '请输入用户昵称', clearable: true}
  },
  {
    name: 'input', label: '邮箱', prop: 'email',
    attrs: {placeholder: '请输入邮箱', clearable: true}
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择用户状态', clearable: true},
    options: statusOptions
  }
])
const userForm$ = ref()
const curUser = reactive<User>({
  nickName: '',
  account: '',
  avatar: '',
  email: '',
  status: 1
})
function addUser (){
  show.value = true
  isEdit.value = false
  title.value = '添加用户'
}
function toggleStatus (row: User) {
  row.status = row.status === 0 ? 1 : 0
}

function edit (row: User) {
  show.value = true
  isEdit.value = true
  title.value = '编辑用户信息'
  Object.assign(curUser, row)
}

function loadData () {
  console.log(formData)
}

function cancel () {
  show.value = false
  userForm$.value.resetFields()
}
function save () {
  show.value = false
  userForm$.value.resetFields()
}
function beforeUpload () {

}
function uploadSuccess () {

}
</script>

<style lang="scss">
.user-manage-page{
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