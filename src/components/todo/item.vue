<template>
  <li class="todo-item" @click="complete">
    <span class="name">{{ item.name }}</span>
    <span class="time">{{ item.relativeTime }}</span>
    <el-tag :type="item.status === 0 ? '' : 'warning'" size="small" round>{{
      item.status === 0 ? '待办' : '进行中'
    }}</el-tag>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Schedule } from '#/global'
export default defineComponent({
  name: 'TodoItem',
  props: {
    item: {
      type: Object as PropType<Schedule>,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    function complete() {
      ctx.emit('complete', props.index, props.item)
    }
    return {
      complete,
    }
  },
})
</script>
