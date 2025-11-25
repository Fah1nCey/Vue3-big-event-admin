<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
import { ElMessageBox } from 'element-plus'

// 加载loading
const loading = ref(false)
const channelList = ref([])
const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

// 操作：编辑
const onEditChannel = (row) => {
  dialog.value.open(row)
}

// 操作： 添加分类
const onAddChannel = () => {
  dialog.value.open({})
}

const onSuccess = () => {
  getChannelList()
}

// 操作： 删除分类
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <!-- 主体部分 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="100">
        <!-- el-table 在渲染每一行数据时，会通过作用域插槽（即 <template #default="scope">）
          向插槽内部传递一个包含当前行信息的对象，这个对象就是 scope。
          它包含了当前行的所有相关数据和状态，比如行数据、行索引等。 -->
        <!-- scope.row 是 scope 对象中的一个属性，代表 当前行对应的原始数据对象。 -->
        <template #default="scope">
          <div class="button-row">
            <el-button
              type="primary"
              :icon="Edit"
              @click="onEditChannel(scope.row)"
              circle
              plain
            />
            <el-button
              type="danger"
              :icon="Delete"
              @click="onDelChannel(scope.row)"
              circle
              plain
            />
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
