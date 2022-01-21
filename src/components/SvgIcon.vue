<template>
  <svg :class="['svg-icon', name]" aria-hidden="true" :style="{fontSize: size + 'rem'}">
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
    },
    size: {
      type: [Number, String],
      default: 1
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