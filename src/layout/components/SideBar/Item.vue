<template>
  <template v-if="hasOneShowingChild(props.data.children, props.data) || !onlyOneChild?.children || onlyOneChild.noShowingChildren">
    <el-menu-item :index="resolvePath(onlyOneChild?.path)">
      <svg-icon :name='onlyOneChild?.meta?.icon' />
      <span>{{onlyOneChild?.meta?.title}}</span>
    </el-menu-item>
  </template>
  <template v-else>
    <el-sub-menu :index="resolvePath(props.data.path)">
      <template #title>
        <svg-icon :name='props.data.meta?.icon' />
        <span>{{props.data.meta?.title}}</span>
      </template>
      <Item
        v-for="child in props.data?.children"
        :key="child.path"
        :data='child'
        :is-nest="true"
        :base-path="resolvePath(child.path)" />
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import {PropType, ref} from 'vue'
import { RouterType } from 'vue-router'

const props = defineProps({
  basePath: {
    type: String,
    default: ''
  },
  data: {
    type: Object as PropType<RouterType>,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  }
});

// import path from 'path'

const onlyOneChild = ref<RouterType | null>(null)!

const hasOneShowingChild = (children: RouterType[] = [], parent: RouterType) => {
  const showingChildren = children.filter(item => {
    if(item.hidden){
      return false
    } else {
      onlyOneChild.value = item
      return true
    }
  })
  if (showingChildren.length === 1) {
    return true
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = {...parent, path: "", noShowingChildren: true}
    return false
  }
  return false
}

const resolvePath = (route: any) => {
  return props.basePath + '' + route
}
</script>