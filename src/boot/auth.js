import { boot } from 'quasar/wrappers'
import { useAuthStore, ROLE, ROLE_HOME } from 'src/stores/authStore'
import { api } from './axios'

export default boot(async ({ router, store }) => {
  const authStore = useAuthStore(store)

  router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some((x) => x.meta.requiresAuth)
    const token = authStore.token_id
    const userRole = authStore.userRole // 'Patient' | 'Doctor' | 'LeadManager'
    const home = ROLE_HOME[userRole] || ROLE_HOME[ROLE.PATIENT]

    // ✅ If route requires authentication but token missing → redirect
    if (requiresAuth && !token) {
      return '/login'
    }

    // ✅ If logged in and opening /login page → redirect to respective home screen
    if (to.path === '/login' && token) {
      return home
    }

    // ✅ Enforce role-based access control
    const matchedRouteWithRole = to.matched.find((x) => x.meta.requiresRole)
    if (matchedRouteWithRole && token) {
      if (userRole !== matchedRouteWithRole.meta.requiresRole) {
        return home
      }
    }

    // ✅ If token exists, set Axios header
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  })
})
