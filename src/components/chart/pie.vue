<template>
  <div class="pie-chart" style="width: 100%; height: 35vh"></div>
</template>

<script setup lang="ts">
import { ECharts } from 'echarts'
import echarts from './index'
import { useEventListener, tryOnUnmounted, useTimeoutFn } from '@vueuse/core'
import { onBeforeMount, onMounted, nextTick, PropType, watch } from 'vue'
import { State } from '#/global'

let echartInstance: ECharts | null
const props = defineProps({
  data: {
    type: Array as PropType<Array<State>>,
    required: true,
  },
})

function initechartInstance() {
  const echartDom = document.querySelector('.pie-chart')
  if (!echartDom) return
  if (echartInstance) {
    echartInstance.dispose()
  }
  // @ts-ignore
  echartInstance = echarts.init(echartDom)
  echartInstance!.clear() //清除旧画布 重新渲染
  echartInstance!.setOption({
    title: {
      text: '文章分类',
      top: 'center',
      left: '34.5%',
      textStyle: {
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {d}%',
    },
    legend: {
      orient: 'vertical',
      right: true,
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: props.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })
}

watch(
  () => props.data,
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
