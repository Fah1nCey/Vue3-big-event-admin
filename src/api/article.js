import request from '@/utils/request'

// 获取文章分类
export const artGetChannelsService = () => {
  return request.get('/category')
}
// 编辑文章分类
export const artEditChannelService = ({ id, categoryName, categoryAlias }) => {
  return request.put('/category', {
    id,
    categoryName,
    categoryAlias
  })
}
// 添加文章分类
export const artAddChannelService = ({ categoryName, categoryAlias }) => {
  return request.post('/category', {
    categoryName,
    categoryAlias
  })
}
// 删除文章分类
export const artDelChannelService = (id) => {
  return request.delete('/category', {
    params: { id }
  })
}
// 获取文章分类详情去哪了，不需要吗？

// 获取文章列表
export const artGetListService = ({ pageNum, pageSize, categoryId, state }) => {
  return request.get('/article', {
    params: { pageNum, pageSize, categoryId, state }
  })
}

// 发布文章
// 注意：参数需要一个formData格式的对象
export const artPublishService = (data) => {
  return request.post('/article', data)
}

// 获取文章详情
export const artGetDetailService = (id) => {
  return request.get('/article/detail', { params: { id } })
}

// 更新文章详情
export const artEditService = (data) => {
  return request.put('/article', data)
}

// 删除文章
export const artDelService = (id) => {
  return request.delete('/article', { params: { id } })
}
