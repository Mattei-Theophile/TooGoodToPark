import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import Api from '../services/api/useApi.js'
export const useUserStore = defineStore(
  'userStore',
  () => {
    const accessToken = ref(JSON.parse(localStorage.getItem('userStore'))?.accessToken || null)
    const isAuthenticated = ref(false)
    const api = Api.useApi()
    const isLoggedIn = () => {
      return !!accessToken.value && isAuthenticated.value
    }

    const login = async (credentials) => {
      try {
        const res = await api.post('/auth/login', credentials)
        if (res.success) {
          accessToken.value = res.accessToken
          isAuthenticated.value = true
        }
        return { success: res.success }
      } catch (err) {
        console.log(err)
        return {
          success: false,
          message: err.message,
        }
      }
    }

    const logout = async () => {
      try {
        await api.post('/auth/logout', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        accessToken.value = null
        isAuthenticated.value = false
      } catch (err) {
        console.log(err)
      }
    }

    const clearAuth = () => {
      accessToken.value = null
      isAuthenticated.value = false
      clearTokens()
    }
    const clearTokens = async () => {
      localStorage.removeItem('userStore')
    }

    const setTokens = async (Token) => {
      try {
        const parsedUser = JSON.parse(localStorage.getItem('userStore'))
        parsedUser.accessToken = Token
        localStorage.setItem('userStore', JSON.stringify(parsedUser))
      } catch (err) {
        console.log(err)
      }
    }

    const initializeAuth = async () => {
      if (!accessToken) {
        try {
          const res = await api.post('/auth/refresh-token', {})

          accessToken.value = res.accessToken
          isAuthenticated.value = true
          await setTokens(res.accessToken)
        } catch (err) {
          console.log(err)
          this.clearAuth()
        }
      } else {
        isAuthenticated.value = true
      }
    }
    return {
      accessToken,
      isAuthenticated,
      isLoggedIn,
      login,
      logout,
      clearAuth,
      initializeAuth,
      setTokens,
    }
  },
  { persist: true },
)
