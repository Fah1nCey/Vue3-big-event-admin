import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

// 用户模块：token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      // axios 原始响应(response)包含 config、headers、data 等多层结构
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }

    return { token, setToken, removeToken, user, getUser, setUser }
  },
  // 配置放在函数的第三个参数中
  {
    persist: true // 持久化
  }
)
