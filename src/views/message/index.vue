<template>
  <div class="message-manage-page">
    <Query :configs='configs' :data='queryData' size='small' inline>
      <el-button type='primary' :icon='Search'>查询</el-button>
    </Query>
    <CustomTable :columns='columns' :data='list'>
      <template #isReply='{row}'>
        <span :class="row.isReply === 0 ? 'no-reply' : 'available'">{{row.isReply === 0 ? '待回复' : '已回复'}}</span>
      </template>
      <template #status='{row}'>
        <span :class="row.status === 0 ? 'invalid' : 'available'">{{row.status === 0 ? '已失效' : '正常'}}</span>
      </template>
      <template #operation='{row}'>
        <el-button type='text' v-if="row.isReply === 0" @click="showReplyDislog">回复</el-button>
        <el-popconfirm confirm-button-text='确认'
          cancel-button-text='取消'
          :icon='InfoFilled'
          icon-color='#fdbc00'
          :title="`确定使该消息${row.status === 0 ? '恢复正常' : '失效'}？`"
          @confirm='toggleStatus(row)'>
          <template #reference>
            <el-button type='text'>{{row.status === 0 ? '恢复正常' : '失效'}}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </CustomTable>
    <Pagination :total='20' />
    <el-dialog v-model='visible' title="回复" width="20%" top="25vh">
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
import {ref, reactive} from 'vue'
import { Search, InfoFilled } from '@element-plus/icons-vue'

import Query from '@/components/query.vue'
import CustomTable from '@/components/table/index.vue'
import Pagination from '@/components/pagination.vue'

const configs = ref<Array<QConfig>>([
  { name: 'input', prop: 'title', label: '标题', attrs: {placeholder: '请输入标题', clearable: true}, },
  {
    name: 'select', label: '回复状态', prop: 'isReply',
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
  name: null,
  status: null,
  isReply: null
})
const columns = ref<Array<ColumnProps>>([
  { attrs: { type: 'index', label: '序号' } },
  { attrs: { prop: 'title', label: '标题' } },
  { attrs: { prop: 'message', label: '内容' } },
  { attrs: { prop: 'time', label: '时间' } },
  { attrs: { prop: 'isReply', label: '是否回复' }, _slot: true},
  { attrs: { prop: 'status', label: '状态' }, _slot: true},
  { attrs: { prop: 'operation', label: '操作', width: 120 }, _slot: true },
])
const list = ref<Array<Message>>([
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 0, status: 0},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 0, status: 1},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 1, status: 0},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 1, status: 1},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 0, status: 0},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 0, status: 1},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 1, status: 0},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 1, status: 1},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 0, status: 0},
  {title: '111', message: '111', time: '2021-12-24 00:37:10', isReply: 0, status: 1},
])
const visible = ref<boolean>(false)
const encryptConfig = ref<Array<QConfig>>([
  {name: 'input', prop: 'reply', attrs: {type: 'textarea', autosize: {minRows: 2, maxRows: 6},  placeholder: '请输入回复内容'}}
])
const encryptForm = reactive({
  reply: null
})
function toggleEncrypt (row: any) {
}
function toggleStatus (row: Message) {
  row.status = row.status === 0 ? 1 : 0
}
function showReplyDislog () {
  visible.value = true
}
function close () {
  visible.value = false
}
function confirm () {
  visible.value = false
}
</script>