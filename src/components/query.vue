<template>
  <el-form v-bind='$attrs' :model='data'>
    <el-form-item v-for="item in configs" :label='item.label' :prop='item.prop'>
      <template v-if="item.name === 'select'">
        <component :is='"el-" + item.name' v-model='data[item.prop]' v-on='item.events || {}'>
          <template v-if="item.group">
            <el-option-group v-for="group in item.options" :label='group.label'>
              <el-option v-for="option in group.options" v-bind='option'></el-option>
            </el-option-group>
          </template>
          <template v-else>
            <el-option v-for="option in item.options" v-bind='option'></el-option>
          </template>
        </component>
      </template>
      <template v-else>
        <template v-if="item.group">
          <component :is="'el-'+ item.name + '-group'" v-model="data[item.prop]" v-bind='item.attrs' v-on='item.events || {}'>
            <component :is="'el-'+item.name + (item.type ? '-' + item.type : '')"
              v-for="option in item.options"
              v-bind='option' />
          </component>
        </template>
         <template v-else>
           <component :is='"el-" + item.name' v-model="data[item.prop]" v-bind='item.attrs' v-on='item.events || {}'/>
         </template>
      </template>
    </el-form-item>
    <slot />
  </el-form>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
<script setup lang="ts">
export interface QConfig {
  name: 'input' | 'select' | 'date-picker' | 'checkbox' | 'radio' | 'switch' | 'rate'
  prop: string
  label: string
  options?: any[]
  group?: boolean
  type?: 'button'
  events?: {
    [k: string]: any
  }
  attrs?: {
    [k: string]: any
  }
}

defineProps<{
  configs: QConfig[],
  data: any
}>()
</script>