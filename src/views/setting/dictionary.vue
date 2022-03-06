<template>
  <div class="dictionary-setting-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' size="small" :icon='Search'>查询</el-button>
      <el-button type='primary' size="small" :icon='CirclePlus' @click="addDict(0)">新增字典</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list' row-key="type">
      <template #operation='{row}'>
        <el-button type='text' @click="editDict(row)">编辑</el-button>
        <el-button type="text" @click="addDict(1, row)">新增子类型</el-button>
        <el-button type='text' v-if="row.children.length === 0" @click="showDict">配置</el-button>
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
    <Pagination :total='pageTotal' />
    <el-dialog v-model='visible' :title="`${isEdit ? '编辑' : '新增'}字典`" width="20%">
      <Query ref="dictForm$" :configs='newConfig' :data='newConfigForm' :rules="dictRules"></Query>
      <template #footer>
        <el-button size='mini' @click="close">关闭</el-button>
        <el-button size='mini' type="primary" @click="confirm">确认</el-button>
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
import { onMounted, reactive, ref, toRaw, watch } from 'vue'
import { Search, InfoFilled, CirclePlus } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

import {getDicts, createDict, putDict} from '@/api'
import { ElNotification } from 'element-plus'

const loading = ref<boolean>(false)
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
const pageTotal = ref<number>(0)
const list = ref<Array<Partial<Dictionary>>>([])
const isEdit = ref<boolean>(false)
const visible = ref<boolean>(false)
const newConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '字典名称', attrs: {placeholder: '请输入字典名称', clearable: true}},
  {name: 'input', prop: 'type', label: '字典类型', attrs: {placeholder: '请输入字典类型', clearable: true, disabled: isEdit}},
])
const newConfigForm = reactive({
  id: null,
  name: null,
  type: null
})
const dictRules = {
  name: [ {required: true, message: '请输入字典名称', trigger: 'blur'} ],
  type: [ {required: true, message: '请输入字典类型', trigger: 'blur'} ],
}

const showConfig = ref<boolean>(false)
const configDetailColumn = ref<Array<ColumnProps>>([
  { attrs: {type: 'selection'}},
  { attrs: {prop: 'name', label: '名称'} },
  { attrs: {prop: 'type', label: '类型'} },
  { attrs: { prop: 'operation', label: '操作', width: 100 }, _slot: true },
])
const configDetail = ref([{name: '可用', type: 1}, {name: '已失效', type: 0}])
const selectedRows = ref([])
const dictForm$ = ref()

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
  dictForm$.value.form$.clearValidate()
  Object.assign(newConfigForm, {id: null, name: null, type: null})
  visible.value = false
}
async function confirm () {
  try {
    const valid = await dictForm$.value.form$.validate()
    if (!valid) {
      return false
    }
    let res
    const data = toRaw(newConfigForm)

    if (isEdit.value) {
      res = await putDict(newConfigForm.id, data)
    } else {
      res = await createDict(data)
    }
    ElNotification({
      title: 'success',
      message: res.msg,
      type: 'success',
      duration: 3000
    })
    loadData()
  } catch (error) {
    throw error
  } finally {
    close()
  }
}
function editDict (row: Dictionary) {
  visible.value = true
  isEdit.value = true
  Object.assign(newConfigForm, row)
}
function deleteDict (row: Dictionary) {
  // list.value = list.value.filter(item => item.type !== row.type)
}

watch(() => isEdit.value, (val: boolean) => {
  console.log(val)
})

async function loadData() {
  loading.value = true
  try {
    const {result: {data, total}} = await getDicts(queryData)
    list.value = data
    pageTotal.value = total
  } catch (error) {
    throw error
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  loadData()
})
</script>