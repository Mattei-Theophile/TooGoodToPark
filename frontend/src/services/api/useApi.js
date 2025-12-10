import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/UserStore.js'

export default {
  useApi() {
    const apiInstance = createApiInstance()
    setupInterceptors(apiInstance)

    const isLoading = ref(false)
    const apiError = ref(null)

    const makeRequest = async (method, url, requestData = null) => {
      isLoading.value = true
      apiError.value = null

      try {
        const requestConfig = { method, url }
        if (requestData) {
          requestConfig.data = requestData
        }

        const response = await apiInstance(requestConfig)
        return response.data
      } catch (err) {
        apiError.value = err
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const get = (url) => makeRequest('GET', url)
    const post = (url, data) => makeRequest('POST', url, data)
    const put = (url, data) => makeRequest('PUT', url, data)
    const del = (url, data = null) => makeRequest('DELETE', url, data)

    return {
      loading: isLoading,
      error: apiError,
      get,
      post,
      put,
      delete: del,
      instance: apiInstance,
    }
  },
}
// Extract configuration constants
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
}

// Extract axios instance creation
const createApiInstance = () => {
  return axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
    withCredentials: true,
  })
}

// Extract token retrieval function
function getStoredToken() {
  try {
    const userStoreData = localStorage.getItem('userStore')
    return userStoreData ? JSON.parse(userStoreData).accessToken : null
  } catch {
    return null
  }
}

// Extract interceptor setup
const setupInterceptors = (axiosInstance) => {
  // Request interceptor for auth token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getStoredToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor for token refresh
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      console.log(error.response)

      if (error.response?.status === 401) {
        console.log('401 error')
        const userStore = useUserStore()

        if (error.response.data?.needsRefresh) {
          console.log('needs refresh')
          try {
            const refreshResponse = await axiosInstance.post('/auth/refresh-token', {})
            await userStore.setTokens(refreshResponse.data.accessToken)
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`
            return axiosInstance(originalRequest)
          } catch (refreshError) {
            await userStore.logout()
            return Promise.reject(refreshError)
          }
        } else if (error.response.data?.requiresLogin) {
          await userStore.logout()
          return Promise.reject(error)
        }
      }
      return Promise.reject(error)
    },
  )
}
