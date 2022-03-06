<template>
  <div class="tabs">
    <el-tabs v-model='activeName' v-bind='$attrs'>
      <template v-for="tab in renderTabs">
        <el-tab-pane :label='tab.label' :name='tab.name'>
          <component v-if="activeName === tab.name" :is="tab.component"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, defineAsyncComponent, onMounted, ref } from 'vue'

export default defineComponent({
  props: {
    tabs: {
      type: Array as PropType<Array<TabsProps>>,
      required: true
    }
  },
  setup (props) {

    const activeName = ref<string>('')

    const renderTabs = computed(() => props.tabs.filter(tab => tab.show)
      .map(_ => ({..._, component: defineAsyncComponent(_.component)}))
    )
    onMounted(() => {
      activeName.value = renderTabs.value[0].name
    })

    return {
      activeName,
      renderTabs
    }
  }
})
</script>