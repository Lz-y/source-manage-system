<template>
  <div class="home">
    <Todo></Todo>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
<script setup lang="ts">
import {reactive, ref} from 'vue-demi'

import Todo from '@/components/todo/index.vue'

</script>