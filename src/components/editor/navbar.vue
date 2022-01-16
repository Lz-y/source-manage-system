<template>
  <div class="editor-navbar">
    <ul class="navbar-wrapper">
      <li class="navbar-item" @click="insertChar('**', '加粗')">
        <el-tooltip content="添加加粗">
          <svg-icon name="bold"></svg-icon>
        </el-tooltip>
      </li>
      <li class="navbar-item" @click="insertChar('*', '斜体')">
        <el-tooltip content="添加斜体">
          <svg-icon name="italic"></svg-icon>
        </el-tooltip>
      </li>
      <li class="navbar-item" @click="insertChar('~~', '删除线')">
        <el-tooltip content="添加删除线">
          <svg-icon name="strikethrough"></svg-icon>
        </el-tooltip>
      </li>
      <li class="navbar-item" @click="insertList('-', '无序')">
        <el-tooltip content="添加无序列表">
          <svg-icon name="unorderedlist"></svg-icon>
        </el-tooltip>
      </li>
      <li class="navbar-item" @click="insertList('1.', '有序')">
        <el-tooltip content="添加有序列表">
          <svg-icon name="orderedlist"></svg-icon>
        </el-tooltip>
      </li>
      <li class="navbar-item" @click="insertList('- [x]', '任务列表')">
        <el-tooltip content="添加任务列表">
          <svg-icon name="carryout"></svg-icon>
        </el-tooltip>
      </li>
      <li class="navbar-item" @click="insertLink">
        <el-tooltip content="添加链接">
          <svg-icon name="link"></svg-icon>
        </el-tooltip>
      </li>
      <li class="navbar-item">
        <el-dropdown trigger="click" max-height="300px" @command="insertCodeBlank">
          <el-tooltip content="添加代码块">
            <svg-icon name="code"></svg-icon>
          </el-tooltip>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in languages" :command="item.key">{{item.language}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li class="navbar-item" @click="insertTable">
        <el-tooltip content="添加表格">
          <svg-icon name="table"></svg-icon>
        </el-tooltip>
      </li>
      <li class="navbar-item" @click="insertImage">
        <el-tooltip content="添加图片">
          <svg-icon name="image"></svg-icon>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ComponentInternalInstance, getCurrentInstance } from 'vue-demi'
import * as insert from './utils'

export default defineComponent({
  setup (props, ctx) {

    const editor: ComponentInternalInstance = getCurrentInstance()!.parent!

    function insertChar (symbol: '**' | '*' | '~~', txt: string) {
      insert.insertChar(editor.refs!.write$ as HTMLTextAreaElement, symbol, txt)
    }
    function insertList (symbol: '-' | '1.' | '- [x]', txt: string) {
      insert.insertList(editor.refs!.write$ as HTMLTextAreaElement, symbol, txt)
    }
    function insertLink () {
      insert.insertLink(editor.refs!.write$ as HTMLTextAreaElement)
    }
    function insertImage () {
      insert.insertImage(editor.refs!.write$ as HTMLTextAreaElement)
    }
    function insertCodeBlank (language: string) {
      insert.insertCodeBlank(editor.refs!.write$ as HTMLTextAreaElement, language)
    }
    function insertTable () {
      insert.insertTable(editor.refs!.write$ as HTMLTextAreaElement)
    }
    return {
      insertChar,
      insertList,
      insertLink,
      insertImage,
      insertCodeBlank,
      insertTable,
      languages: insert.codeLanguage
    }
  }
})
</script>

<style lang="scss">
.editor-navbar{
  line-height: 1.5;
}
.navbar-wrapper{
  list-style: none;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 10px;
   .navbar-item{
     text-align: center;
     display: inline-block;
     cursor: pointer;
     padding-left: 0.5rem;
   }
}
</style>