<template>
  <div class="pie-chart" style="width: 100%; height: 30vh;"></div>
</template>

<script setup lang="ts">
import {ECharts} from 'echarts'
import echarts from './index'
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core"
import { onBeforeMount, onMounted, nextTick } from "vue"

let echartInstance: ECharts | null
// const props = defineProps({
//   index: {
//     type: Number,
//     default: 0
//   }
// })

function initechartInstance() {
  const echartDom = document.querySelector(".pie-chart")
  if (!echartDom) return
  // @ts-ignore
  echartInstance = echarts.init(echartDom)
  echartInstance!.clear() //清除旧画布 重新渲染
  echartInstance!.setOption({
    title: {
      text: '文章类别',
      top: 'center',
      left: '34.5%',
      textStyle: {
        fontSize: 12
      }
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      right: true
    },
    series: [
      {
        name: "Github信息",
        type: "pie",
        radius: ["40%", '70%'],
        center: ["40%", "50%"],
        data: [
          { value: 1079, name: "watchers" },
          { value: 1079, name: "star" },
          { value: 204, name: "forks" },
          { value: 100, name: "open_issues" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  })
}

onBeforeMount(() => {
  nextTick(() => {
    initechartInstance()
  })
})

onMounted(() => {
  nextTick(() => {
    useEventListener("resize", () => {
      if (!echartInstance) return
      useTimeoutFn(() => {
        echartInstance!.resize()
      }, 180)
    })
  })
})

tryOnUnmounted(() => {
  if (!echartInstance) return
  echartInstance.dispose()
  echartInstance = null
})
</script>