<template>
  <div class="bar-chart" style="width: 100%; height: 30vh"></div>
</template>

<script setup lang="ts">
import { ECharts } from 'echarts'
import echarts from './index'
import { useEventListener, tryOnUnmounted, useTimeoutFn } from '@vueuse/core'
import { onBeforeMount, onMounted, nextTick, PropType } from 'vue'

let echartInstance: ECharts | null
const props = defineProps({
  data: {
    type: Array as PropType<Array<number>>,
  },
})

function initechartInstance() {
  const echartDom = document.querySelector('.bar-chart')
  if (!echartDom) return
  if (echartInstance) {
    echartInstance.dispose()
  }
  // @ts-ignore
  echartInstance = echarts.init(echartDom)
  echartInstance!.clear() //清除旧画布 重新渲染
  echartInstance!.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      bottom: '10%',
      height: '75%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          interval: 0,
          width: '70',
          overflow: 'truncate',
        },
        data: ['open_issues', 'forks', 'watchers', 'star'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'GitHub信息',
        type: 'bar',
        data: [60, 204, 1079, 1079],
      },
    ],
  })
}

onBeforeMount(() => {
  nextTick(() => {
    initechartInstance()
  })
})

onMounted(() => {
  nextTick(() => {
    useEventListener('resize', () => {
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
