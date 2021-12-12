<template>
  <el-table-column v-bind='item'>
    <template v-for="child in item._children">
      <columnItem v-if="child._children" :item='child'/>
      <el-table-column v-else v-bind='child'>
        <slot v-if="child._slot" :name='child.name' :data='child'></slot>
      </el-table-column>
    </template>
    <slot v-if="item._slot" :name='item.name' :data='item'></slot>
  </el-table-column>
</template>

<script setup lang="ts">
export interface ColumnProps {
  name: string
  label: string
  _children?: Array<ColumnProps>
  _slot?: boolean
}

defineProps<{item: ColumnProps}>()
</script>