<template>
  <div class="role-info">
    <el-dropdown trigger='hover' size='small' placement='bottom-end'>
      <div class="user-name-avatar">
        <span>lan - 管理员</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
</script>