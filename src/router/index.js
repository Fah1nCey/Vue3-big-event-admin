import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

import layoutContainer from '@/views/layout/LayoutContainer.vue'
import LoginPage from '@/views/login/LoginPage.vue'
import ArticleManage from '@/views/article/ArticleManage.vue'
import ArticleChannel from '@/views/article/ArticleChannel.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import UserAvatar from '@/views/user/UserAvatar.vue'
import UserPassword from '@/views/user/UserPassword.vue'
import NotFound from '@/views/404/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginPage },
    {
      path: '/',
      component: layoutContainer,
      redirect: '/article/manage',
      // 当在页面中点击链接跳转，只是部分内容切换时，我们可以使用嵌套路由(二级路由)
      children: [
        { path: '/article/manage', component: ArticleManage },
        { path: '/article/channel', component: ArticleChannel },
        { path: '/user/profile', component: UserProfile },
        { path: '/user/avatar', component: UserAvatar },
        { path: '/user/password', component: UserPassword }
      ]
    },
    // /:pathMatch(.*)* 是 Vue Router 4 中定义全匹配路由的标准写法
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]
})

// 登录访问拦截 => 默认是直接放行
// 根据返回值决定，是放行还是拦截
// 返回值：(三种方式)
// 1. undefined / true 直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象， 拦截到对应的地址
//    'login' 或 {name: 'login'}
router.beforeEach((to) => {
  // 如果没有token, 且访问页非登录页，拦截到登录页，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path != '/login') {
    return '/login'
  }
})

export default router
