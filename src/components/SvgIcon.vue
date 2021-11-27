<template>
  <svg :class="['svg-icon', name]" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue"
defineProps({
  name: {
    type: String,
    required: true
  }
})

const iconName = computed(() => `#icon-${name}`)
</script>