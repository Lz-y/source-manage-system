<template>
  <div class="user-manage-page">
    <Query :configs="configs" :data="formData" size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button type='primary'>导出用户数据</el-button>
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
        <el-button type='text' size='small'>编辑</el-button>
      </template>
    </CustomTable>
    <pagination :total="10" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserManagePage'
}
</script>
<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { Search, InfoFilled } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  {
    name: 'input', label: '用户昵称', prop: 'name',
    attrs: {placeholder: '请输入用户账号或昵称', clearable: true}
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择用户状态', clearable: true},
    options: [{label: '已启用', value: 1}, {label: '已禁用', value: 2}]
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
      label: '操作'
    },
    _slot: true
  }
])

const formData = reactive({
  name: '',
  status: null
})

const tableData = ref<Array<User>>([
  {account: '', nickName: 'lan', avatar: '6666', email: '1111', status: 0},
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

function toggleStatus (row: User) {
  row.status = row.status === 0 ? 1 : 0
}

function loadData () {
  console.log(formData)
}
</script>