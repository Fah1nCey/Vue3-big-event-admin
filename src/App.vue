<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
</script>

<template>
  <!-- 国际化处理 -->
  <el-config-provider :locale="zh">
    <router-view />
  </el-config-provider>

  <!-- 上面写了，不要重复写router-view, 否则页面重复渲染 -->
  <!-- <router-view></router-view> -->
</template>

<style scoped></style>
