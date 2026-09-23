import { defineStore } from 'pinia'
import { Loading, LocalStorage, Notify } from 'quasar'
import { api } from 'src/boot/axios'

/**
 * `base_role` codes as returned by the CRM login response.
 *
 * TODO(api): LEAD_MANAGER is a placeholder. In the CRM a lead manager is the
 * Ion Auth group `Lead-manager`, not a numeric code — confirm with Satish what
 * the login API returns. Until then the label check in resolveRole() is what
 * actually matches a lead manager.
 */
export const BASE_ROLE = {
  DOCTOR: '4',
  PATIENT: '5',
  LEAD_MANAGER: '6',
}

/** Roles the app routes on. */
export const ROLE = {
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  LEAD_MANAGER: 'LeadManager',
}

/** Landing screen for each role — the single place redirects are decided. */
export const ROLE_HOME = {
  [ROLE.DOCTOR]: '/physio',
  [ROLE.PATIENT]: '/',
  [ROLE.LEAD_MANAGER]: '/lead-manager',
}

const LABEL_TO_ROLE = {
  doctor: ROLE.DOCTOR,
  patient: ROLE.PATIENT,
  leadmanager: ROLE.LEAD_MANAGER,
}

/**
 * Work out a user's role from whatever the backend sent. Login responses carry
 * a `role`/`group` label and the stored user carries a numeric `base_role`, so
 * both are checked here rather than at every call site. Labels are normalised,
 * so the CRM's `Lead-manager` group matches.
 *
 * @param {object|null} user
 * @returns {string} one of ROLE.*
 */
export function resolveRole(user) {
  if (!user) return ROLE.PATIENT

  const label = String(user.role || user.group || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
  if (LABEL_TO_ROLE[label]) return LABEL_TO_ROLE[label]

  const code = String(user.base_role ?? '')
  if (code === BASE_ROLE.DOCTOR) return ROLE.DOCTOR
  if (code === BASE_ROLE.LEAD_MANAGER) return ROLE.LEAD_MANAGER
  return ROLE.PATIENT
}

/** Home path for a user object. Falls back to the patient app. */
export const homeForUser = (user) => ROLE_HOME[resolveRole(user)] || ROLE_HOME[ROLE.PATIENT]

let token_id = LocalStorage.getItem('token_id') ? LocalStorage.getItem('token_id') : null
let bearer = LocalStorage.getItem('bearer') ? LocalStorage.getItem('bearer') : null
let user = LocalStorage.getItem('user') ? JSON.parse(LocalStorage.getItem('user')) : null
let user_id = LocalStorage.getItem('user_id') ? JSON.parse(LocalStorage.getItem('user_id')) : null

export const useAuthStore = defineStore('backend_auth', {
  state: () => ({
    user: user,
    user_id: user_id,
    bearer: bearer,
    token_id: token_id,
    expireAt: null,
    serverError: null,
    loginData: {
      username: null,
      password: null,
    },
    initinalLoginData: {
      username: null,
      password: null,
    },
    requiresPasswordReset: false,
    resetEmail: null,
  }),
  getters: {
    isServeError: (state) => {
      return state.serverError ? true : false
    },
    userRole: (state) => resolveRole(state.user),
  },
  actions: {
    login() {
      this.resetServerError()
      Loading.show()
      api
        .post('authenticateCredentials', this.loginData)
        .then((response) => {
          const userData = response.data?.user

          if (userData && userData.token) {
            this.setUserData(response)
            Notify.create({
              type: 'positive',
              message: response.data.message || 'Login successful',
            })
            this.pushWithPromise(this.router, homeForUser(userData))
              .then(() => {
                this.resetAction()
              })
              .catch((e) => {
                console.log(e)
              })
          } else if (userData && !userData.is_password_generated) {
            Loading.hide()
            this.resetEmail = userData.email
            this.requiresPasswordReset = true
            this.loginData.password = null // clear OTP out
            Notify.create({
              type: 'info',
              message: 'OTP verified. Please set your permanent password.',
            })
          } else {
            Loading.hide()
            this.serverError = 'Invalid response structure.'
            Notify.create({
              type: 'negative',
              message: response.data.message || 'Invalid response structure.',
              html: true,
            })
          }
        })
        .catch((e) => {
          Loading.hide()
          console.log(e)
          this.serverError =
            e.response?.data?.message || 'An error occurred during login. Please try again.'
        })
    },
    resetPassword(newPassword) {
      this.resetServerError()
      Loading.show()
      api
        .post('resetPassword', {
          username: this.resetEmail,
          password: newPassword,
        })
        .then((response) => {
          Loading.hide()
          Notify.create({
            type: 'positive',
            message: response.data.message || 'Password reset successfully',
          })
          this.requiresPasswordReset = false
          this.resetEmail = null
          this.loginData.password = newPassword
          this.login() // Automatically log them in with the new credentials
        })
        .catch((e) => {
          Loading.hide()
          console.log(e)
          this.serverError = e.response?.data?.message || 'Failed to set password.'
        })
    },
    setUserData(response) {
      Loading.hide()
      const userData = response.data.user

      this.user = userData
      this.user_id = userData.id || userData.user_id
      this.token_id = userData.token

      LocalStorage.set('user', JSON.stringify(userData))
      LocalStorage.set('user_id', JSON.stringify(this.user_id))
      LocalStorage.set('token_id', this.token_id)

      this.setTokenInApi(this.token_id)
    },
    setTokenInApi(payload) {
      api.defaults.headers.common.Authorization = 'Bearer ' + payload
    },
    resetAction() {
      Object.assign(this.loginData, { ...this.initinalLoginData })
    },
    resetServerError() {
      this.serverError = null
    },
    async logout() {
      await api
        .get('logout')
        .then((response) => {
          this.user = null
          this.user_id = null
          this.token_id = null
          delete api.defaults.headers.common.Authorization
          LocalStorage.clear()
          Notify.create({
            type: 'positive',
            message: response.data.message,
          })
        })
        .catch((e) => {
          Loading.hide()
          console.log(e)
          this.user = null
          this.user_id = null
          this.token_id = null
          delete api.defaults.headers.common.Authorization
          LocalStorage.clear()
          this.serverError = e.response?.data?.message || 'Logout failed'
        })
    },
    pushWithPromise(router, location) {
      return new Promise((resolve, reject) => {
        router.push(
          location,
          () => {
            resolve() // Navigation completed successfully
          },
          (err) => {
            reject(err) // Navigation failed with an error
          },
        )
      })
    },
  },
})
