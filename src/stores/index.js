import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// 相当于
// import { useUserStore } from './user'
// export { useUserStore }
export * from './modules/user'
