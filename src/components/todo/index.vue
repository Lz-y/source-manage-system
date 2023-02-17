<template>
  <div class="todo">
    <h3 class="title">待办事项</h3>
    <el-scrollbar max-height="300px">
      <ul class="todo-list">
        <todo-item v-for="(item, index) in data" :item="item" :index="index" />
      </ul>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TodoItem from './item.vue'
import { Schedule } from '#/global'
export default defineComponent({
  name: 'Todo',
  components: {
    TodoItem,
  },
  props: {
    data: {
      type: Array as PropType<Array<Schedule>>,
      required: true,
    },
  },
  setup(props, ctx) {
    return {}
  },
})
</script>

<style lang="scss">
.todo {
  background-color: #fff;
  position: relative;
  padding: 10px 15px 0;
  .title {
    margin-top: 0;
    margin-bottom: 10px;
    color: #5e5e5e;
    font-weight: 500;
    font-size: 1rem;
    // padding: 10px 0 0 10px;
    // text-align: center;
  }
  &-list {
    list-style: none;
    margin: 0;
    padding: 0;

    & > :not(:last-child) {
      border-bottom: 1px solid #ededed;
    }
  }
  &-item {
    overflow: hidden;
    padding: 6px 10px;
    box-sizing: border-box;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 14px;
  }
}
</style>
