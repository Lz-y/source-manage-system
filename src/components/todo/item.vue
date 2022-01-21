<template>
  <li class="todo-item">
    <span class='check'>
      <span class='check_inner' :class='item.finished ? "is-completed" : ""' @click='complete'>
        <input class='check_origin' type='checkbox' :value='item.name'/>
      </span>
      <span>{{item.name}}</span>
    </span>
    <el-icon @click='removeTodo'><close /></el-icon>
  </li>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue-demi'
import {Close} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'TodoItem',
  components: {
    Close
  },
  props: {
    item: {
      type: Object as PropType<Todo>,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  setup (props, ctx) {
    function complete() {
      props.item.finished = !props.item.finished
      ctx.emit('complete', props.index, props.item)
    }
    function removeTodo() {
      ctx.emit('remove-todo', props.index, props.item)
    }
    return {
      complete,
      removeTodo
    }
  }
})
</script>