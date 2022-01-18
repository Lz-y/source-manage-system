<template>
  <div class="dictionary-setting-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
      <el-button type='primary' :icon='CirclePlus' @click="addDict(0)">新增字典</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list' row-key="type">
      <template #operation='{row}'>
        <el-button type='text' @click="editDict(row)">编辑</el-button>
        <el-button type="text" @click="addDict(1, row)">新增子类型</el-button>
        <el-button type='text' v-if="!row.children" @click="showDict">配置</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          title="确认删除该字典？"
          @confirm='deleteDict(row)'>
          <template #reference>
            <el-button type='text'>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='0' />
    <el-dialog v-model='visible' :title="`${isEdit ? '编辑' : '新增'}字典`" width="20%">
      <Query :configs='newConfig' :data='newConfigForm'></Query>
      <template #footer>
        <el-button size='small' @click="close">关闭</el-button>
        <el-button size='small' type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="showConfig" direction="rtl" size="30%">
      <el-button
        size="small"
        :icon='CirclePlus'
        style="margin-bottom: 10px;"
        @click="addDict(0)">添加</el-button>
      <CustomTable :columns="configDetailColumn" :data="configDetail" @selection-change="selectConfig" border>
        <template #operation='{row}'>
          <el-button type='text' @click="editDict(row)">编辑</el-button>
          <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          title="确认删除该配置？"
          @confirm='deleteDict(row)'>
          <template #reference>
            <el-button type='text'>删除</el-button>
          </template>
        </el-popconfirm>
        </template>
      </CustomTable>
      <el-row type="flex" justify="end" style="margin-top: 10px;">
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary">保存</el-button>
      </el-row>
    </el-drawer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DictionarySettingManagePage'
}
</script>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue-demi'
import { Search, InfoFilled, CirclePlus } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'name', label: '字典名称', attrs: {placeholder: '请输入字典名称', clearable: true}, },
])
const queryData = reactive({
  name: null,
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { prop: 'name', label: '字典名称' } },
  { attrs: { prop: 'type', label: '字典类型'} },
  { attrs: { prop: 'operation', label: '操作', width: 220 }, _slot: true },
])
const list = ref<Array<Partial<Dictionary>>>([
  {name: '状态', type: 'status', children: [{name: '服务状态', type: 'serviceStatus'}, {name: '在线状态', type: 'onlineStatus'}]}
])
const isEdit = ref<boolean>(false)
const visible = ref<boolean>(false)
const newConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '字典名称', attrs: {placeholder: '请输入字典名称', clearable: true}},
  {name: 'input', prop: 'type', label: '字典类型', attrs: {placeholder: '请输入字典类型', clearable: true, disabled: isEdit}},
])
const newConfigForm = ref({
  name: '',
  type: ''
})

const showConfig = ref<boolean>(false)
const configDetailColumn = ref<Array<ColumnProps>>([
  { attrs: {type: 'selection'}},
  { attrs: {prop: 'name', label: '名称'} },
  { attrs: {prop: 'type', label: '类型'} },
  { attrs: { prop: 'operation', label: '操作', width: 100 }, _slot: true },
])
const configDetail = ref([{name: '可用', type: 1}, {name: '已失效', type: 0}])
const selectedRows = ref([])

function addDict (type: 0 | 1, row?: Dictionary) {
  visible.value = true
  isEdit.value = false
  type === 1 
}
function showDict () {
  showConfig.value = true
}
function selectConfig (selection: any) {
  console.log(selection)
}
function close () {
  visible.value = false
}
function confirm () {
  visible.value = false
  // list.value.push(newConfigForm.value)
}
function editDict (row: Dictionary) {
  visible.value = true
  isEdit.value = true
  newConfigForm.value = row
}
function deleteDict (row: Dictionary) {
  // list.value = list.value.filter(item => item.type !== row.type)
}

watch(() => isEdit.value, (val: boolean) => {
  console.log(val)
})
</script>