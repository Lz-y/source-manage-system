<template>
  <el-table v-bind='$attrs'>
    <ColumnItem v-for="column in columns" :item='column' />
  </el-table>
</template>

<script lang="ts">
export default {
  name: 'CustomTable'
}
</script>
<script setup lang="ts">
import ColumnItem, {ColumnProps} from './columnItem.vue'


defineProps<{columns: Array<ColumnProps>}>()
</script>