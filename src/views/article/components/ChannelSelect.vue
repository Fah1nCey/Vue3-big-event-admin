<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
// 文章管理员搜索栏中的文章分类下拉选择器组件
const channelList = ref([])
const getChannelList = async () => {
  const arr = await artGetChannelsService()
  channelList.value = arr.data.data
}
getChannelList()

defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <!-- 子组件使用 modelValue 作为 props 名称，并用 update:modelValue 作为事件名称，核心目的就是为了让父组件能直接通过 v-model 进行双向绑定 -->
  <!-- :modelValue="modelValue"：父传子（数据从父组件到子组件） -->
  <!-- 作用：让子组件的选择器（el-select）初始值与父组件传递的值保持一致。 -->
  <!-- @update:modelValue="emit('update:modelValue', $event)"：子传父（数据从子组件到父组件） -->
  <!-- 作用：当用户在子组件中选择新选项时，自动通知父组件 “值变了”，让父组件更新自己的数据。 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    placeholder="请选择"
    :style="{ width: width || '220px' }"
  >
    <!--  { width } 是 { width: width } 的简写  -->
    <!-- 如果对象的 属性名 和 变量名 完全相同，可以省略冒号和后面重复的变量名 -->
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.categoryName"
      :value="channel.id"
    />
  </el-select>
</template>
