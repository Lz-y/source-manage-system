<template>
  <div class="line-chart" style="width: 100%; height: 30vh;"></div>
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
  const echartDom = document.querySelector(".line-chart")
  if (!echartDom) return
  // @ts-ignore
  echartInstance = echarts.init(echartDom)
  echartInstance!.clear() //清除旧画布 重新渲染
  echartInstance!.setOption({
    title: {
      text: '每天完成的 task 数',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    grid: {
      bottom: "10%",
      height: "75%",
      containLabel: true
    },
    tooltip: {
      trigger: "item"
    },
    xAxis: {
      type: "category",
      axisLabel: {
        interval: 0
      },
      data: ["open_issues", "forks", "watchers", "star"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [3, 204, 1079, 1079],
        type: "line",
        smooth: true,
        areaStyle: {}
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