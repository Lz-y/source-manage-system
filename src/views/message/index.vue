<template>
  <div class="message-manage-page" v-loading="loading">
    <Query :configs="configs" :data="queryData" inline>
      <el-button type="primary" :icon="Search" @click="loadData"
        >查询</el-button
      >
    </Query>
    <CustomTable :columns="columns" :data="list">
      <template #replyStatus="{ row }">
        <span :class="row.replyStatus === 0 ? 'no-reply' : 'available'">{{
          ReplyStatusOptions[row.replyStatus].label
        }}</span>
      </template>
      <template #status="{ row }">
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{
          StatusOptions[row.status].label
        }}</span>
      </template>
      <template #operation="{ row }">
        <el-button
          type="primary"
          size="small"
          v-if="row.replyStatus === 0"
          @click="showReplyDislog(row)"
          text
          >回复</el-button
        >
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#fdbc00"
          :title="`确定使该消息${row.status === 0 ? '恢复正常' : '失效'}？`"
          @confirm="toggleStatus(row)"
        >
          <template #reference>
            <el-button type="primary" size="small" text>{{
              row.status === 0 ? '恢复正常' : '失效'
            }}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total="pageTotal" />
    <el-dialog
      v-model="visible"
      title="回复"
      width="20%"
      top="35vh"
      :close-on-click-modal="false"
    >
      <Query
        ref="encryptForm$"
        :configs="encryptConfig"
        :data="encryptForm"
      ></Query>
      <template #footer>
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="confirm">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MessageManagePage',
}
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

import { getMessages, putMessage, getOneDict } from '@/api'
import { QConfig, ColumnProps, Message, KeyMap } from '#/global'

const StatusOptions = ref<Array<KeyMap>>([])
const ReplyStatusOptions = ref<Array<KeyMap>>([])
const configs = ref<Array<QConfig>>([
  {
    name: 'input',
    prop: 'title',
    label: '标题',
    attrs: { placeholder: '请输入标题', clearable: true },
  },
  {
    name: 'select',
    label: '回复状态',
    prop: 'replyStatus',
    attrs: { placeholder: '请选择回复状态', clearable: true },
    options: [],
  },
  {
    name: 'select',
    label: '消息状态',
    prop: 'status',
    attrs: { placeholder: '请选择消息状态', clearable: true },
    options: [],
  },
])
const queryData = reactive({
  message: null,
  status: null,
  replyStatus: null,
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '#' } },
  { attrs: { prop: 'message', label: '消息' } },
  { attrs: { prop: 'replyContent', label: '回复内容' } },
  { attrs: { prop: 'createTime', label: '时间' } },
  { attrs: { prop: 'replyStatus', label: '是否回复' }, _slot: true },
  { attrs: { prop: 'status', label: '状态' }, _slot: true },
  { attrs: { prop: 'operation', label: '操作', width: 130 }, _slot: true },
])
const list = ref<Array<Message>>([])
const pageTotal = ref<number>(0)
const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
const encryptConfig = ref<Array<QConfig>>([
  {
    name: 'input',
    prop: 'reply',
    attrs: {
      type: 'textarea',
      autosize: { minRows: 2, maxRows: 6 },
      placeholder: '请输入回复内容',
    },
  },
])
const encryptForm = reactive({
  _id: null,
  reply: null,
})
const encryptForm$ = ref()

async function toggleStatus(row: Message) {
  try {
    const { msg } = await putMessage(row._id, {
      status: row.status === 0 ? 1 : 0,
    })
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
function showReplyDislog(row: Message) {
  visible.value = true
  encryptForm._id = row._id as any
  nextTick(() => {
    encryptForm$.value.form$.$el.querySelector('.el-textarea__inner').focus()
  })
}
function close() {
  visible.value = false
  Object.assign(encryptForm, { _id: null, reply: null })
}
async function confirm() {
  try {
    const { msg } = await putMessage(encryptForm._id, {
      replyContent: encryptForm.reply,
    })
    ElNotification({
      title: 'success',
      message: msg,
      type: 'success',
      duration: 3000,
    })
    loadData()
  } catch (error) {
    throw error
  } finally {
    close()
  }
}
async function getDicts() {
  try {
    const [replyStatus, status] = await Promise.all([
      getOneDict({ type: 'SYS_MESSAGE_REPLY_STATUS' }),
      getOneDict({ type: 'SYS_STATUS' }),
    ])
    configs.value[1].options = replyStatus.data
    configs.value[2].options = status.data
    StatusOptions.value = status.data
    ReplyStatusOptions.value = replyStatus.data
  } catch (error) {
    throw error
  }
}
async function loadData() {
  loading.value = true
  try {
    const {
      result: { data, total },
    } = await getMessages(queryData)
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
async function initData() {
  await getDicts()
  await loadData()
}
onMounted(() => {
  initData()
})
</script>
