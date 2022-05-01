<template>
  <div class="dictionary-setting-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' size="small" :icon='Search'>查询</el-button>
      <el-button size="small" :icon='CirclePlus' @click="addDict">新增字典</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list'>
      <template #status="{row}">
        <el-tag :type="row.status === 1 ? 'success': 'info'" size="small">{{row.status === 1 ? '启用': '禁用'}}</el-tag>
      </template>
      <template #operation='{row}'>
        <el-button type='text' size="small" @click="editDict(row)">编辑</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          title="确认删除该字典？"
          @confirm='deleteDict(row)'>
          <template #reference>
            <el-button type='text' size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='pageTotal' />
    <el-dialog v-model='visible' :title="`${isEdit ? '编辑' : '新增'}字典`" width="40%" top="20vh" :close-on-click-modal="false">
      <el-form :model="dictForm" :rules="dictRules" ref="dictForm$" size="mini" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item prop="name" label="字典名称">
							<el-input v-model="dictForm.name" :disabled="isEdit" placeholder="请输入字典名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item prop="type" label="字段名">
							<el-input v-model="dictForm.type" :disabled="isEdit" placeholder="请输入字段名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<el-form-item prop="status" label="字典状态">
							<el-switch v-model="dictForm.status" inline-prompt active-text="启" inactive-text="禁" :active-value="1" :inactive-value="0"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div style="width: 115px;text-align: right; margin-bottom: 10px;">
              <span>字典属性</span>
              <el-button type="primary" circle @click="onAddRow" style="margin-left: 10px;">
                <el-icon :size='16'>
                  <CirclePlus/>
                </el-icon>
              </el-button>
            </div>
						<el-row :gutter="20" v-for="(v, k) in dictForm.children">
							<el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
								<el-form-item label="标签名">
									<el-input v-model="v.label" placeholder="请输入标签名"> </el-input>
								</el-form-item>
							</el-col>
              <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
								<el-form-item label="字段" label-width="40px">
									<el-input v-model="v.key" placeholder="请输入字段"> </el-input>
								</el-form-item>
							</el-col>
              <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
								<el-form-item label="属性值" label-width="60px">
									<el-input v-model="v.value" style="max-width: 80%;margin-right: 10px;" placeholder="请输入属性值"> </el-input>
                  <el-button type="danger" circle @click="onDelRow(k)">
                    <el-icon :size='16'>
                      <Delete/>
                    </el-icon>
                  </el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<el-form-item prop="description" label="字典描述">
							<el-input v-model="dictForm.description" type="textarea" placeholder="请输入字典描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
      <template #footer>
        <el-button size='mini' @click="close">关闭</el-button>
        <el-button size='mini' type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DictionarySettingManagePage'
}
</script>
<script setup lang="ts">
import { onMounted, reactive, ref, toRaw, nextTick } from 'vue'
import { Search, InfoFilled, CirclePlus, Delete } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

import {getDicts, createDict, putDict, delDict, getOneDict} from '@/api'
import {QConfig, ColumnProps, Dictionary} from '#/global'

const StatusOptions = [{label: '禁用', value: 0}, {label: '启用', value: 1}]
const loading = ref<boolean>(false)
const configs = ref<Array<QConfig>>([
  { name: 'input', label: '字典名称/类型',  prop: 'name', attrs: {placeholder: '请输入字典名称/类型', clearable: true}, },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择状态', clearable: true},
    options: StatusOptions
  },
])
const queryData = reactive({
  name: null,
  status: null
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { label: '#', type: 'index' } },
  { attrs: { prop: 'name', label: '字典名称' } },
  { attrs: { prop: 'type', label: '字典类型'} },
  { attrs: { prop: 'status', label: '字典状态'}, _slot: true },
  { attrs: { prop: 'description', label: '字典描述'} },
  { attrs: { prop: 'createTime', label: '创建时间'} },
  { attrs: { prop: 'operation', label: '操作', width: 150 }, _slot: true },
])
const pageTotal = ref<number>(0)
const list = ref<Array<Partial<Dictionary>>>([])
const isEdit = ref<boolean>(false)
const visible = ref<boolean>(false)

const dictForm = reactive<Dictionary>({
  _id: null,
  name: '',
  type: 'SYS_',
  status: 1,
  children: [
    {label: '', value: '', key: ''}
  ],
  description: '',
})
const dictRules = {
  name: [ {required: true, message: '请输入字典名称', trigger: 'blur'} ],
  type: [ {required: true, message: '请输入字典类型', trigger: 'blur'} ],
}

const dictForm$ = ref()

function addDict () {
  visible.value = true
  isEdit.value = false
}
function onAddRow () {
  dictForm.children!.push({label: '', value: '', key: ''})
}

function onDelRow (i: number) {
  dictForm.children!.splice(i, 1)
}

function close () {
  dictForm$.value.clearValidate()
  visible.value = false
  nextTick(() => {
    Object.assign(dictForm, {
      _id: null,
      name: null,
      type: 'SYS_',
      status: 1,
      children: [{label: '', value: '', key: ''}],
      description: ''
    })
  })
}
async function confirm () {
  try {
    const valid = await dictForm$.value.validate()
    if (!valid) {
      return false
    }
    let res
    const data = toRaw(dictForm)

    if (isEdit.value) {
      res = await putDict(dictForm._id, data)
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
  Object.assign(dictForm, {
    _id: row._id,
    name: row.name,
    type: row.type,
    status: row.status,
    children: row.children,
    description: row.description
  })
}

async function deleteDict (row: Dictionary) {
  try {
    const {msg} = await delDict(row._id)
    ElNotification({
      title: 'success',
      message: msg,
      type: 'success',
      duration: 3000
    })
    loadData()
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function loadData() {
  loading.value = true
  try {
    const {result: {data, total}} = await getDicts(queryData)
    data.forEach((item: Dictionary) => {
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
async function getDictStatus () {
  try {
    const {data} = await getOneDict({type: 'SYS_STATUS'})
    configs.value[1].options = data
  } catch (error) {
    throw error
  }
}
async function initData() {
  await getDictStatus()
  await loadData()
}
onMounted(() => {
  initData()
})
</script>