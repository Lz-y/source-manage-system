<template>
  <svg :class="['svg-icon', name]" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const iconName = computed(() => `#icon-${props.name}`)
    return {
      iconName
    }
  }
})
</script>