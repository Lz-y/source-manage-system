<template>
  <div class="page-user-manage">
    <Query :configs="configs" :data="formData" inline></Query>
    <CustomTable :columns="columns" :data='tableData'>
      <template #account>
        <span>111</span>
      </template>
      <template #nickName='{row, $index}'>
        <span>222</span>
      </template>
      <template #aa>
        <span>333</span>
      </template>
      <template #bb>
        <span>444</span>
      </template>
    </CustomTable>
    <pagination :load="loadData"/>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue-demi'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  { name: 'input', label: '用户昵称', prop: 'name' },
  { name: 'select', label: '状态', prop: 'status', attrs: {placeholder: '请选择用户状态'},
    options: [{label: '全部', value: 0}, {label: '已启用', value: 1}, {label: '已禁用', value: 2}]
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
      prop: 'age',
      label: '年龄',
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
    }
  },
  {
    attrs: {
      prop: 'operation',
      label: '操作'
    }
  }
])

const formData = reactive({
  name: '',
  status: null
})

const tableData = ref([
  {account: 11111, nickName: 'lan', age: 23, gender: 'm', avatar: '6666'}
])

function loadData () {
  console.log(formData)
}

</script>