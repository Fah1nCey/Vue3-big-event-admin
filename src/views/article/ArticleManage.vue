<script setup>
// element-plus按需自动引入彩蛋，components里的组件，不需要引入即可直接使用
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
const loading = ref(false)
const params = ref({
  // 当前是第几页
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
const articleList = ref([])
const total = ref(0)
const articleEditRef = ref()

// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const arr = await artGetListService(params.value)
  articleList.value = arr.data.data
  total.value = arr.data.total
  loading.value = false
}
getArticleList()

// 搜索、重置
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  params.value.pagenum = 1
  ;((params.value.cate_id = ''), (params.value.state = ''))
  getArticleList()
}

// 分页逻辑
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

// 编辑文章
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
// 删除文章
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}
// 添加文章
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 添加/编辑文章后重新渲染数据
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>
    <el-form :inline="true">
      <el-form-item label="文章分类：">
        <!-- Vue2 => v-model: value 和 @input 的简写-->
        <!-- Vue3 => v-model: modelValue 和 @update:modelValue 的简写-->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select
          v-model="params.state"
          placeholder="请选择"
          style="width: 180px"
        >
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="articleList" v-loading="loading" style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <!-- row 是当前行对应的数据对象，它由表格的 :data 数据源自动提供，用于在模板中访问当前行的具体数据。 -->
        <template #default="{ row }">
          <el-link type="primary" underline="never">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" />
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页组件 -->
    <!-- 在标签中使用响应式对象不需要.value -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 抽屉组件 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
