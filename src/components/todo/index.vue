<template>
  <div class="todo">
    <h3 class='title'>待办事项</h3>
    <el-scrollbar max-height='300px'>
      <ul class="todo-list">
        <todo-item v-for="(item, index) in todos" :item="item" :index='index'  @remove-todo='removeTodo'></todo-item>
      </ul>
    </el-scrollbar>
    <div class="record">
      <span class='todo-count'>
        <strong>{{unfinished}}</strong>
        items left
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed } from 'vue'
import TodoItem from './item.vue'
export default defineComponent({
  name: 'Todo',
  components: {
    TodoItem
  },
  setup (props, ctx) {
    const todos = ref<Array<Todo>>([
      {name: '学习vue3 响应式原理', finished: false},
      {name: '学习vue-router 源码', finished: false},
      {name: '学习Go', finished: false},
      {name: '学习可视化', finished: false},
      {name: '学习 MySQL', finished: false},
      {name: '学习 MongoDB', finished: false},
      {name: '使用 React 完成一个项目', finished: false},
      {name: '学习 Flutter', finished: false},
      {name: '学习网络编程', finished: false},
    ])

    const unfinished = computed(() => todos.value.filter(_ => !_.finished).length)
    // function completeTodo (n: number) {
    //   console.log(n)
    // }
    function removeTodo(n: number) {
      todos.value.splice(n, 1)
    }
    return {
      todos,
      unfinished,
      // completeTodo,
      removeTodo
    }
  }
})
</script>

<style lang="scss">
.todo{
  background-color: #fff;
  position: relative;
  padding: 10px;
  .title{
    margin-top: 0;
    margin-bottom: 10px;
    color: #5e5e5e;
    font-weight: 500;
    font-size: 1rem;
    // padding: 10px 0 0 10px;
    // text-align: center;
  }
  &-list{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  &-item{
    vertical-align: middle;
    overflow: hidden;
    padding: 10px;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 14px;
    border-bottom: 1px solid #ededed;
    
    .check{
      position: relative;
      line-height: 1;
      display: flex;
      align-items: center;
      cursor: pointer;
      &_inner{
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid #ededed;
        margin-right: 10px;
        display: inline-block;

        &::after{
          content: "";
          position: absolute;
          border: 2px solid #0ac710;
          border-left: none;
          border-top: none;
          width: 7px;
          height: 14px;
          transform: rotate(45deg);
          opacity: 0;
          left: 12px;
          top: 5px;
          transition: opacity 0.2s ease-in;
          transform-origin: center;
        }
        &.is-completed::after{
          opacity: 1
        }
        &.is-completed + span{
          color: #d9d9d9;
          text-decoration: line-through;
        }
      }

      &_origin{
        position: absolute;
        width: 0;
        height: 0;
        z-index: -1;
        opacity: 0;
        outline: none;
      }
    }
    .el-icon{
      display: none;
    }
    &:hover .el-icon{
      display: block;
    }
  }
  
  .record{
    color: #777;
    padding: 8px 15px;
    text-align: center;
    position: relative;
  }
}
</style>