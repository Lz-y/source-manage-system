<template>
  <div class="dictionary-setting-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' size="small" :icon='Search'>查询</el-button>
      <el-button type='primary' size="small" :icon='CirclePlus' @click="addDict">新增字典</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list'>
      <template #status="{row}">
        <el-tag :type="row.status === 1 ? 'success': 'info'" size="small">{{row.status === 1 ? '启用': '禁用'}}</el-tag>
      </template>
      <template #operation='{row}'>
        <el-button type='text' @click="editDict(row)">编辑</el-button>
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
    <el-dialog v-model='visible' :title="`${isEdit ? '编辑' : '新增'}字典`" width="35%">
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
						<el-row :gutter="35" v-for="(v, k) in dictForm.children" :key="k">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
								<el-form-item :prop="v.label">
									<template #label>
										<el-button type="primary" circle @click="onAddRow" v-if="k === 0">
											<el-icon :size='16'>
												<CirclePlus/>
											</el-icon>
										</el-button>
										<el-button type="danger" circle @click="onDelRow(k)" v-else>
											<el-icon :size='16'>
												<Delete/>
											</el-icon>
										</el-button>
										<span class="ml10">字段</span>
									</template>
									<el-input v-model="v.label" style="width: 100%" placeholder="请输入字段名"> </el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
								<el-form-item label="属性" :prop="v.value">
									<el-input v-model="v.value" style="width: 100%" placeholder="请输入属性值"> </el-input>
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
import { onMounted, reactive, ref, toRaw, watch, nextTick } from 'vue'
import { Search, InfoFilled, CirclePlus, Delete } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

import {getDicts, createDict, putDict, delDict} from '@/api'
import { ElNotification } from 'element-plus'

const loading = ref<boolean>(false)
const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'name', attrs: {placeholder: '请输入字典名称', clearable: true}, },
])
const queryData = reactive({
  name: null,
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

const dictForm = reactive({
  _id: null,
  name: null,
  type: 'SYS_',
  status: 1,
  children: [
    {label: '', value: ''}
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
  dictForm.children.push({label: '', value: ''})
}

function onDelRow (i: number) {
  dictForm.children.splice(i, 1)
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
      children: [{label: '', value: ''}]
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
  Object.assign(dictForm, row)
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