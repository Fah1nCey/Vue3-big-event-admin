import axios from 'axios'
import { useUserStore } from '@/stores/index'

import { ElMessage } from 'element-plus'

import router from '@/router'

// `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 标记是否正在处理 401 错误（防止重复触发登录）
let isRefreshing = false

// instance 是通过 axios.create() 创建的自定义 axios 实例
const instance = axios.create({
  // 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    //  2. 请求头携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
      // console.log('请求头信息：', config)
    }
    return config
  },
  (err) => Promise.reject(err) // 对请求错误做些什么
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    //  4. 摘取核心响应数据
    if (res.data.code === 0) {
      // console.log('响应数据是：', res)
      return res
    }
    //  3. 处理业务失败
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    //  5. 处理401错误
    // 错误的特殊情况 => 401权限不足 或 token过期 => 拦截到登录
    // 补充：1. err.response.status 是 HTTP 协议规定的标准状态码（由 Web 服务器或后端框架返回）
    // 2. 后端在处理 “权限不足 /token 过期” 时，遵循了 HTTP 标准，返回了 401 状态码
    if (err.response?.status === 401) {
      if (!isRefreshing) {
        // 加锁
        isRefreshing = true
        ElMessage.error(err.response.data.message || '服务异常')
        router.push('/login')
      }
    } else {
      // 错误的默认情况 => 只要给提示
      ElMessage.error(err.response.data.message || '服务异常')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
