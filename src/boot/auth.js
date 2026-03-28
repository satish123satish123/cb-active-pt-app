import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/authStore'
import { api } from './axios'

export default boot(async ({ router, store }) => {
  const authStore = useAuthStore(store)

  router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some((x) => x.meta.requiresAuth)
    let token = authStore.token_id

    // ✅ If route requires authentication but token missing → redirect
    if (requiresAuth && !token) {
      return '/login'
    }

    // ✅ If logged in and opening /login page → redirect to dashboard
    if (to.path === '/login' && token) {
      return '/'
    }

    // ✅ If token exists, set Axios header
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  })
})
