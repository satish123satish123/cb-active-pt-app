import { defineStore } from 'pinia'
import { Loading, LocalStorage, Notify } from 'quasar'
import { api } from 'src/boot/axios'

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
            this.pushWithPromise(this.router, '/')
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
