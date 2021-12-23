<template>
  <el-table v-bind='$attrs'>
    <Columns v-for="column in columns" :item='column' :key="column.attrs.prop || column.attrs.type" />
  </el-table>
</template>

<script lang="ts">
import { defineComponent, provide, PropType, getCurrentInstance } from 'vue-demi'
import Columns from './columns.vue'

export default defineComponent({
  name: 'CustomTable',
  props: {
    columns: {
      type: Array as PropType<Array<ColumnProps>>,
      required: true,
      default: () => []
    },
    maxLevel: {
      type: Number,
      default: 3
    }
  },
  components: {
    Columns
  },
  setup () {
    const instance = getCurrentInstance()

    provide('RootTable', instance)

    return {
    }
  }
})
</script>