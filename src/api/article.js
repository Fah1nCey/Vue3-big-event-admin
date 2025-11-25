import request from '@/utils/request'

// 获取文章分类
export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}

// 编辑文章分类
export const artEditChannelService = ({ id, cate_name, cate_alias }) => {
  return request.put('/my/cate/info', { id, cate_name, cate_alias })
}
// 添加文章分类
export const artAddChannelService = ({ cate_name, cate_alias }) => {
  return request.post('/my/cate/add', { cate_name, cate_alias })
}
// 删除文章分类
export const artDelChannelService = (id) => {
  return request.delete('/my/cate/del', {
    params: { id }
  })
}

// 获取文章列表
export const artGetListService = ({ pagenum, pagesize, cate_id, state }) => {
  return request.get('/my/article/list', {
    params: { pagenum, pagesize, cate_id, state }
  })
}

// 发布文章
// 注意：参数需要一个formData格式的对象
export const artPublishService = (data) => {
  return request.post('/my/article/add', data)
}

// 获取文章详情
export const artGetDetailService = (id) => {
  return request.get('/my/article/info', { params: { id } })
}

// 更新文章详情
export const artEditService = (data) => {
  return request.put('/my/article/info', data)
}

// 删除文章
export const artDelService = (id) => {
  return request.delete('/my/article/info', { params: { id } })
}
