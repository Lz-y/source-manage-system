<template>
  <div class="dynamic-prompt"
    @keyup.up="selectPrevRow"
    @keyup.down="selectNextRow"
    @keyup.enter="confirmSelectRow">
    <el-popover
      v-model:visible="visible"
      trigger="manual"
      width='auto'
      :popper-options='popoverConfig'
      @show='showPopOver'>
      <template #reference>
        <el-input
          v-model='txt'
          :placeholder="placeholder"
          @input="inputTxt"
          @focus="inputFocus"
          @blur="inputBlur" />
      </template>
      <CustomTable
        v-if="type === 'table'"
        ref="table"
        v-loading='loading'
        :columns="config"
        :data="data"
        highlight-current-row
        @current-change='handleCurrentRowChange'
        ></CustomTable>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import {ref, nextTick} from 'vue'
import CustomTable from '@/components/table/index.vue'
import { reactive } from 'vue'

const props = withDefaults(defineProps<{
  data: Array<any>
  type?: 'table' | 'list'
  config: Array<ColumnProps>
  loading?: boolean
  placeholder?: string
}>(), {
  type: 'table',
  loading: false
})

const emit = defineEmits<{
  (e: 'current-row', payload: any): void
}>()

const txt = ref<string>('')
const visible = ref<boolean>(false)
const currentRowNum = ref<number>(0)
const currentRow = ref<AnyTypeObject>()
const table = ref<any>()

const popoverConfig = reactive({
  placement: 'bottom',
  modifiers: [{
    name: 'preventOverflow',
    options: {
      padding: 8,
      boundary: 'viewprot'
    }
  },
  {
    name: 'flip',
    options: {
      fallbackPlacements: ['top', 'right'],
    },
  }]
})

function inputTxt () {
  txt.value && (visible.value = true)
}
function inputFocus () {
  txt.value && (visible.value = true)
}
function inputBlur () {
  visible.value = false
  txt.value = ''
}

function handleCurrentRowChange (val: any) {
  currentRow.value = val
}

function selectPrevRow () {
  currentRowNum.value = currentRowNum.value <= 0 ? props.data.length - 1 : --currentRowNum.value
  table.value.$refs.table.setCurrentRow(props.data[currentRowNum.value])
}
function selectNextRow () {
  currentRowNum.value = currentRowNum.value >= props.data.length - 1 ? 0 : ++currentRowNum.value
  table.value.$refs.table.setCurrentRow(props.data[currentRowNum.value])
}

function confirmSelectRow () {
  emit('current-row', currentRow.value)
  txt.value = ''
}

function showPopOver () {
  currentRowNum.value = 0
  nextTick(() => {
    table.value.$refs.table.setCurrentRow(props.data[currentRowNum.value])
  })
}
</script>