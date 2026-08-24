import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/authStore'
import { api } from './axios'

export default boot(async ({ router, store }) => {
  const authStore = useAuthStore(store)

  router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some((x) => x.meta.requiresAuth)
    const token = authStore.token_id
    const userRole = authStore.userRole // 'Patient' or 'Doctor'

    // ✅ If route requires authentication but token missing → redirect
    if (requiresAuth && !token) {
      return '/login'
    }

    // ✅ If logged in and opening /login page → redirect to respective home screen
    if (to.path === '/login' && token) {
      return userRole === 'Doctor' ? '/physio' : '/'
    }

    // ✅ Enforce role-based access control
    const matchedRouteWithRole = to.matched.find((x) => x.meta.requiresRole)
    if (matchedRouteWithRole && token) {
      const requiredRole = matchedRouteWithRole.meta.requiresRole
      if (userRole !== requiredRole) {
        return userRole === 'Doctor' ? '/physio' : '/'
      }
    }

    // ✅ If token exists, set Axios header
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  })
})