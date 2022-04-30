<template>
  <div class="project-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search' @click="loadData">查询</el-button>
      <el-button :icon='CirclePlus' @click="create">添加项目</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list'>
      <template #img='{row}'>
        <img :src="row.img" style="max-width: 40px;"/>
      </template>
      <template #link='{row}'>
        <a :href="row.link" target="_blank">{{row.link}}</a>
      </template>
      <template #status='{row}'>
        <el-icon size='18' :color="row.status === 0 ? '#fdbc00' : '#0ac710'">
          <VideoPause v-if="row.status === 0"/>
          <VideoPlay v-else />
        </el-icon>
        <span :style="{color: row.status === 0 ? '#fdbc00' : '#0ac710'}">{{StatusOptions[row.status].label}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' size="small" @click="edit(row)">编辑</el-button>
        <el-button type='text' size="small" @click="view(row)">详情</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`是否${row.status === 0 ? '启动' : '暂停'}该项目？`"
          @confirm='toggleRunning(row)'>
          <template #reference>
            <el-button type='text' size="small">{{row.status === 0 ? '启动' : '暂停'}}</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          title="确认删除该项目？"
          @confirm='del(row._id)'>
          <template #reference>
            <el-button type='text' size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='pageTotal' />
    <el-dialog v-model="show" width="30%" :title="title" top="25vh">
      <el-row>
        <el-col :md="8" :sm="6" :xs="4">
          <el-upload
            class="avatar-upload"
            action=""
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload">
              <img :src="curProject.img" alt="avatar" v-if="curProject.img" class="avatar" />
              <el-icon v-else class="avatar-upload-icon">
                <plus />
              </el-icon>
          </el-upload>
        </el-col>
        <el-col :span="16">
          <Query ref="projectForm$" :configs="projectForm" :data="curProject" label-width="80px" size="small"></Query>
        </el-col>
      </el-row>
      <template #footer>
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ProjectManagePage'
}
</script>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Search, InfoFilled, Plus, CirclePlus, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'
import {createProject, deleteProject, getProjects, putProject, getOneDict} from '@/api'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const StatusOptions = [{label: '未启动', value: 0}, {label: '运行中', value: 1}]
const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'title', label: '项目名称', attrs: {placeholder: '请输入项目名称', clearable: true}, },
  {
    name: 'select', label: '类别', prop: 'classify',
    attrs: {placeholder: '请选择类别', clearable: true},
    options: []
  },
  {
    name: 'select', label: '状态', prop: 'status',
    attrs: {placeholder: '请选择状态', clearable: true},
    options: StatusOptions
  }
])
const queryData = reactive({
  name: null,
  classify: null,
  status: null,
})

const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '#' } },
  { attrs: { prop: 'name', label: '项目名称' } },
  { attrs: { prop: 'img', label: '封面/图标', width: 100 }, _slot: true },
  { attrs: { prop: 'link', label: '链接'}, _slot: true },
  { attrs: { prop: 'classify', label: '类别', width: 90 } },
  { attrs: { prop: 'description', label: '描述' } },
  { attrs: { prop: 'createTime', label: '创建时间', width: 165 } },
  { attrs: { prop: 'runingTime', label: '运行时间', width: 100 } },
  { attrs: { prop: 'status', label: '运行状态', width: 100 }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 160 }, _slot: true },
])
const list = ref<Array<Project>>([])
const pageTotal = ref<number>(0)
const loading = ref<boolean>(false)

const show = ref<boolean>(false)
const title = ref<string>()

const isEdit = ref<boolean>(false)
const projectForm = ref<Array<QConfig>>([
  {
    name: 'input', label: '项目名称', prop: 'name',
    attrs: {placeholder: '请填写项目名称', clearable: true}
  },
  {
    name: 'input', label: '链接', prop: 'link',
    attrs: {placeholder: '请填写链接', clearable: true}
  },
  {
    name: 'select', label: '项目分类', prop: 'classify',
    attrs: {placeholder: '请选择项目分类', clearable: true},
    options: []
  },
  {
    name: 'select', label: '运行状态', prop: 'status',
    attrs: {placeholder: '请选择运行状态', clearable: true},
    options: StatusOptions
  },
  {
    name: 'input', label: '项目简介', prop: 'description',
    attrs: {type: 'textarea', placeholder: '请填写项目简介', clearable: true}
  },
])
const projectForm$ = ref()
const curProject = reactive<Project>({
  name: '',
  img: '',
  link: '',
  description: '',
  classify: '',
  status: 0
})
function beforeUpload () {

}
function uploadSuccess () {

}

function create() {
  show.value = true
  isEdit.value = false
  title.value = '新建项目'
}

function edit(row: Project) {
  show.value = true
  isEdit.value = true
  title.value = `编辑项目-${row.name}`
  Object.assign(curProject, {
    _id: row._id,
    name: row.name,
    img: row.img,
    link: row.link,
    description: row.description,
    classify: row.classify,
    status: row.status
  })
}

function view(row: Project) {
  // router.push({name: 'projectDetail', params: {id: row._id}})
}

async function del (id: string) {
  try {
    const {msg} = await deleteProject(id)
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

async function toggleRunning (row: Project) {
  try{
  const {msg} = await putProject(row._id, {status: row.status === 0 ? 1: 0})
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

function cancel () {
  show.value = false
  projectForm$.value.form$.clearValidate()
  Object.assign(curProject, {
    name: '',
    img: '',
    link: '',
    description: '',
    classify: '',
    runing: 1
  })
  curProject._id && delete curProject._id
}

async function save () {
  try {
    let res
    if (isEdit.value) {
      res = await putProject(curProject._id!, curProject)
    } else {
      res = await createProject(curProject)
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
    cancel()
  }
}

async function loadData() {
  loading.value = true
  try {
    const {result: {data, total}} = await getProjects(queryData)
    data.forEach((item: Project) => {
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      item.runingTime = dayjs(item.createTime).toNow(true)
    })
    list.value = data
    pageTotal.value = total
  } catch (error) {
    throw error
  } finally {
    loading.value = false
  }
}
async function getClassifies () {
  try {
    const {data} = await getOneDict({type: 'SYS_TAGS'})
    configs.value[1].options = data
    projectForm.value[2].options = data
  } catch (error) {
    throw error
  }
}
onMounted(() => {
  loadData()
  getClassifies()
})
</script>

<style lang="scss">
.project-manage-page{
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