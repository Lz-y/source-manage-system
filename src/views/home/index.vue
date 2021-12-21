<template>
  <div class="home">
    <query :configs="configs" :data="queryForm" size='small' inline>
      <template #default>
        <el-button>click</el-button>
      </template>
    </query>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
<script setup lang="ts">
import {reactive, ref} from 'vue-demi'
import query from '@/components/query.vue'

const configs = ref<Array<QConfig>>([
  {name: 'input', prop: 'name', label: '姓名'},
  {name: 'input', prop: 'name', label: '姓名'},
  {name: 'input', prop: 'name', label: '姓名'},
  {name: 'input', prop: 'name', label: '姓名'},
  {name: 'select', prop: 'age', label: '年龄', group: true, options: [{label: '0', options:[{label: '0', value: 0}]}]},
  {name: 'date-picker', prop: 'date', label: 'date', attrs: {placeholder: '请选择日期'}},
])
const queryForm = reactive({
  name: null,
  age: null,
  date: null
})
</script>