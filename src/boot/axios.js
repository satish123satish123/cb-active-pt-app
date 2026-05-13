import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
let CRM_API_URL = `${process.env.API_PROTOCOL}://${process.env.API_URL}/api/`
const api = axios.create({ baseURL: CRM_API_URL })

let ASSESSMENT_API_URL = `${process.env.ASSESSMENT_API_PROTOCOL}://${process.env.ASSESSMENT_API_URL}/api/`
const assessment_api = axios.create({
  baseURL: ASSESSMENT_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.ASSESSMENT_API_TOKEN}`,
  },
})

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  app.config.globalProperties.$assessment_api = assessment_api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, assessment_api }
