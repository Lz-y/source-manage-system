<template>
  <div class="pagination">
    <el-pagination
      v-model:currentPage='page'
      v-model:pageSize='pageSize'
      :page-sizes='[10, 20, 30, 50, 100]'
      :page-size='pageSize'
      layout='total, sizes, prev, pager, next, jumper'
      :total='total'
      @current-change='pageChange'
      @size-change='pageSizeChange'
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue-demi'

export default defineComponent({
  props: {
    total: {
      type: Number,
      default: 0,
      required: true
    }
  },
  emits: ['page-change', 'page-size-change'],
  setup (props, ctx) {
    const page = ref<number>(1)
    const pageSize = ref<number>(10)
    function pageSizeChange (size: number) {
      pageSize.value = size
      ctx.emit('page-size-change', size)
    }
    function pageChange (p: number) {
      page.value = p
      ctx.emit('page-change', p)
    }

    return {
      page,
      pageSize,
      pageSizeChange,
      pageChange
    }
  }
})
</script>