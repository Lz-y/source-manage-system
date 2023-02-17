<template>
  <div class="line-chart" style="width: 100%; height: 35vh"></div>
</template>

<script setup lang="ts">
import { ECharts } from 'echarts'
import echarts from './index'
import { useEventListener, tryOnUnmounted, useTimeoutFn } from '@vueuse/core'
import { onBeforeMount, onMounted, nextTick, PropType, watch } from 'vue'

let echartInstance: ECharts | null
const props = defineProps({
  xaixs: {
    type: Array as PropType<Array<string>>,
  },
  replied: {
    type: Array as PropType<Array<number>>,
    required: true,
  },
  unreplied: {
    type: Array as PropType<Array<number>>,
    required: true,
  },
})

function initechartInstance() {
  const echartDom = document.querySelector('.line-chart')
  if (!echartDom) return
  if (echartInstance) {
    echartInstance.dispose()
  }
  // @ts-ignore
  echartInstance = echarts.init(echartDom)
  echartInstance!.clear() //清除旧画布 重新渲染
  echartInstance!.setOption({
    title: {
      text: '系统消息',
      x: 'left',
      textStyle: {
        fontSize: 14,
      },
    },
    grid: {
      top: 70,
      right: 20,
      bottom: 45,
      left: 30,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: { data: ['已读消息', '未读消息'], right: 0 },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0,
      },
      data: props.xaixs,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: props.replied,
        name: '已读消息',
        type: 'line',
        smooth: true,
        symbolSize: 6,
        symbol: 'circle',
        lineStyle: { color: '#fe9a8b' },
        itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fe9a8bb3' },
            { offset: 1, color: '#fe9a8b03' },
          ]),
        },
      },
      {
        name: '未读消息',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: props.unreplied,
        lineStyle: { color: '#9E87FF' },
        itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#9E87FFb3' },
            { offset: 1, color: '#9E87FF03' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: '#9E87FF' },
                { offset: 0.4, color: '#9E87FF' },
                { offset: 0.5, color: '#fff' },
                { offset: 0.7, color: '#fff' },
                { offset: 0.8, color: '#fff' },
                { offset: 1, color: '#fff' },
              ],
            },
            borderColor: '#9E87FF',
            borderWidth: 2,
          },
        },
      },
    ],
  })
}

watch(
  () => [props.replied, props.unreplied],
  () => {
    initechartInstance()
  },
  {
    deep: true,
    immediate: true,
  }
)

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
