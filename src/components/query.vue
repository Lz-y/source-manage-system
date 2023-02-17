<template>
  <div class="query">
    <el-form v-bind="$attrs" ref="form$" :model="data">
      <el-form-item
        v-for="item in configs"
        :label="item.label"
        :prop="item.prop"
      >
        <template v-if="item.name === 'select'">
          <el-select
            :is="'el-' + item.name"
            v-model="data[item.prop]"
            v-bind="item.attrs"
            v-on="item.events || {}"
          >
            <template v-if="item.group">
              <el-option-group
                v-for="group in item.options"
                :label="group.label"
              >
                <el-option v-for="option in group.options" v-bind="option" />
              </el-option-group>
            </template>
            <template v-else>
              <el-option v-for="option in item.options" v-bind="option" />
            </template>
          </el-select>
        </template>
        <template v-else>
          <template v-if="item.group">
            <component
              :is="'el-' + item.name + '-group'"
              v-model="data[item.prop]"
              v-bind="item.attrs"
              v-on="item.events || {}"
            >
              <component
                :is="'el-' + item.name + (item.type ? '-' + item.type : '')"
                v-for="option in item.options"
                v-bind="option"
              />
            </component>
          </template>
          <template v-else>
            <component
              :is="`el-${item.name}`"
              v-model="data[item.prop]"
              v-bind="item.attrs"
              v-on="item.events || {}"
            />
          </template>
        </template>
      </el-form-item>
      <slot />
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref, defineExpose } from 'vue'
import { ElForm, ElSelect, ElOption } from 'element-plus'
import { QConfig } from '#/global'
export default {
  inheritAttrs: false,
}
</script>
<script setup lang="ts">
defineProps<{
  configs: QConfig[]
  data: any
}>()
const form$ = ref<InstanceType<typeof ElForm>>()

defineExpose({
  form$,
})
</script>
