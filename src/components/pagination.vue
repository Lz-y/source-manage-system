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
    load: {
      type: Function,
      required: true,
      default: () => {}
    }
  },
  setup (props) {
    const page = ref<number>(1)
    const pageSize = ref<number>(10)
    const total = ref<number>(0)
    function pageSizeChange (size: number) {
      pageSize.value = size
    }
    function pageChange (p: number) {
      page.value = p
    }

    return {
      page,
      pageSize,
      total,
      pageSizeChange,
      pageChange
    }
  }
})
</script>