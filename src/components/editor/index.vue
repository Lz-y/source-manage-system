<template>
  <div class="editor">
    <Navbar />
    <div class="editor-container">
      <textarea ref="write$" id="write" v-model='originalText' placeholder="请输入正文" @scroll="handleScroll(1, $event)"></textarea>
      <div ref="render$" id="render" v-html='parseText' @scroll="handleScroll(2, $event)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted,onUnmounted, nextTick } from "vue-demi"
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import Navbar from './navbar.vue'

let md: MarkdownIt
export default defineComponent({
  name: 'MarkdownEditor',
  components: {
    Navbar
  },
  setup () {

    md = new MarkdownIt({
      linkify: true,
      typographer: true,
      highlight: function (code: string, language: string) {
        if (language && hljs.getLanguage(language)) {
          try {
            return `<pre class='hljs'><code class='language-${language}'>${hljs.highlight(code, {language}).value}</code></pre>`
          } catch (error) {
            console.log(error)
          }
        }
        return `<pre class='hljs'><code>${md.utils.escapeHtml(code)}</code>`
      }
    })
    const originalText = ref<string>('')

    const parseText = computed(() => md.render(originalText.value))

    const write$ = ref<HTMLTextAreaElement>()
    const render$ = ref<HTMLDivElement>()

    let scrolling: 0 | 1 | 2 = 0
    let scrollTimer: any

    function handleScroll (block: number, e: Event) {
      const {scrollHeight, scrollTop, offsetHeight} = e.target as HTMLElement
      const rate = scrollTop / (scrollHeight - offsetHeight)

      if (block === 1) {
        if (scrolling === 2) {// 展示区触发编辑区滚动
          return
        }
        if (scrolling === 0) {
          scrolling = 1// 记录触发滚动的区域
        }
        driveScroll(rate, render$.value!)
      } else if (block === 2) {
        if (scrolling === 1) {// 编辑区触发展示区滚动
          return
        }
        if (scrolling === 0) {// 记录触发滚动的区域
          scrolling = 2
        }
        driveScroll(rate, write$.value!)
      }
    }

    const driveScroll = (rate: number, el: HTMLElement) => {
      const {scrollHeight, offsetHeight} = el!
      el!.scrollTop = (scrollHeight - offsetHeight) * rate
      if (scrollTimer) {
        clearTimeout(scrollTimer)
      }
      scrollTimer = setTimeout(() => {
        scrolling = 0
        clearTimeout(scrollTimer)
      }, 200)
    }

    onMounted(() => {
      nextTick(() => {
        write$.value?.focus()
      })
    })
    onUnmounted(() => {
      clearTimeout(scrollTimer)
    })

    return {
      originalText,
      parseText,
      write$,
      render$,
      handleScroll
    }
  }
})
</script>

<style lang="scss">
.editor{
  width: 100%;
  height: 100%;
  overflow: hidden;
  &-container{
    max-height: 500px;
    height: 500px;
    width: 100%;
    overflow: hidden;
  }
  textarea#write{
    width: 50%;
    min-height: 500px;
    float: left;
    outline-style: none;
    padding: 20px;
    border-style: none;
    background-color: #f8f8f8;
    resize: none;
    box-sizing: border-box;
  }
  #render {
    padding: 20px;
    overflow: auto;
    float: left;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>