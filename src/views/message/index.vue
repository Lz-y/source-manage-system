<template>
  <div class="message-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
    </Query>
    <CustomTable v-loading="loading" :columns='columns' :data='list'>
      <template #replyStatus='{row}'>
        <span :class="row.replyStatus === 0 ? 'no-reply' : 'available'">{{row.replyStatus === 0 ? '待回复' : '已回复'}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{row.status === 0 ? '已失效' : '正常'}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' size="small" v-if="row.replyStatus === 0" @click="showReplyDislog(row)">回复</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定使该消息${row.status === 0 ? '恢复正常' : '失效'}？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text' size="small">{{row.status === 0 ? '恢复正常' : '失效'}}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='20' />
    <el-dialog v-model='visible' title="回复" width="20%" top="35vh">
      <Query :configs='encryptConfig' :data='encryptForm'></Query>
      <template #footer>
        <el-button size='small' @click="close">关闭</el-button>
        <el-button size='small' type="primary" @click="confirm">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MessageManagePage'
}
</script>
<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

import {getMessages, putMessage} from '@/api'

const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'title', label: '标题', attrs: {placeholder: '请输入标题', clearable: true}, },
  {
    name: 'select', label: '回复状态', prop: 'replyStatus',
    attrs: {placeholder: '请选择回复状态', clearable: true},
    options: [{label: '待回复', value: 0}, {label: '已回复', value: 1}]
  },
  {
    name: 'select', label: '消息状态', prop: 'status',
    attrs: {placeholder: '请选择消息状态', clearable: true},
    options: [{label: '已失效', value: 0}, {label: '正常', value: 1}]
  }
])
const queryData = reactive({
  message: null,
  status: null,
  replyStatus: null
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'message', label: '消息' } },
  { attrs: { prop: 'replyContent', label: '回复内容' } },
  { attrs: { prop: 'createTime', label: '时间' } },
  { attrs: { prop: 'replyStatus', label: '是否回复' }, _slot: true},
  { attrs: { prop: 'status', label: '状态' }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])
const list = ref<Array<Message>>([])
const pageTotal = ref<number>(0)
const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
const encryptConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'reply', attrs: {type: 'textarea', autosize: {minRows: 2, maxRows: 6},  placeholder: '请输入回复内容'}}
])
const encryptForm = reactive({
  _id: null,
  reply: null
})

async function toggleStatus (row: Message) {
  try{
  const {msg} = await putMessage(row._id, {status: row.status === 0 ? 1: 0})
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
function showReplyDislog (row: Message) {
  visible.value = true
  encryptForm._id = row._id as any
}
function close () {
  visible.value = false
  Object.assign(encryptForm, {_id: null, reply: null})
}
async function confirm () {
  try {
    const {msg} = await putMessage(encryptForm._id, {replyContent: encryptForm.reply})
    ElNotification({
      title: 'success',
      message: msg,
      type: 'success',
      duration: 3000
    })
    loadData()
  } catch (error) {
    throw error
  } finally{
    close()
  }
}
async function loadData() {
  loading.value = true
  try {
    const {result: {data, total}} = await getMessages(queryData)
    data.forEach((item: Message) => {
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
onMounted(() => {
  loadData()
})
</script>