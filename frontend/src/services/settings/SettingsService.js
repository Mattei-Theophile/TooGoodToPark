import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/UserStore.js'

// Default settings structure
const defaultSettings = {
  theme: 'light',
  language: 'fr',
  fontSize: 'medium',
  imageQuality: 'high',
  autoSave: true,
  compressionLevel: 80,
  notifications: {
    email: true,
    push: true,
    sound: true,
    marketing: false,
  },
  dataCollection: false,
  analytics: false,
  cookies: 'essential',
  twoFactorAuth: false,
  sessionTimeout: 30,
  autoLogout: true,
  rememberMe: false,
  defaultView: 'grid',
  itemsPerPage: 20,
  debugMode: false,
  experimentalFeatures: false,
}

class SettingsAPI {
  static async getSettings() {
    const token = localStorage.getItem('auth_token')
    const response = await fetch('http://localhost:3000/api/user/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Failed to fetch settings')
    return response.json()
  }

  static async updateSettings(settings) {
    const token = localStorage.getItem('auth_token')
    const response = await fetch('http://localhost:3000/api/user/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) throw new Error('Failed to update settings')
    return response.json()
  }
}

export function useSettings() {
  const settings = ref({ ...defaultSettings })
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => isLoggedIn())
  const storageKey = 'noname-vue-settings'

  // Load settings from appropriate source
  const loadSettings = async () => {
    isLoading.value = true
    error.value = null

    try {
      let loadedSettings = {}

      if (isAuthenticated.value) {
        // Load from API for authenticated users
        try {
          loadedSettings = await SettingsAPI.getSettings()
        } catch (apiError) {
          console.warn('Failed to load settings from API, falling back to localStorage:', apiError)
          // Fallback to localStorage if API fails
          const localSettings = localStorage.getItem(storageKey)
          loadedSettings = localSettings ? JSON.parse(localSettings) : {}
        }
      } else {
        // Load from localStorage for anonymous users
        const localSettings = localStorage.getItem(storageKey)
        loadedSettings = localSettings ? JSON.parse(localSettings) : {}
      }

      // Merge with defaults to ensure all properties exist
      settings.value = { ...defaultSettings, ...loadedSettings }
    } catch (err) {
      error.value = err.message
      console.error('Failed to load settings:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Save settings to appropriate destination
  const saveSettings = async () => {
    try {
      if (isAuthenticated.value) {
        // Save to API for authenticated users
        await SettingsAPI.updateSettings(settings.value)
        // Also save locally as backup
        localStorage.setItem(storageKey, JSON.stringify(settings.value))
      } else {
        // Save to localStorage for anonymous users
        localStorage.setItem(storageKey, JSON.stringify(settings.value))
      }
    } catch (err) {
      error.value = err.message
      console.error('Failed to save settings:', err)
      // If API fails, at least save locally
      localStorage.setItem(storageKey, JSON.stringify(settings.value))
    }
  }

  // Migrate local settings to server when user logs in
  const migrateLocalSettingsToServer = async () => {
    if (!isAuthenticated.value) return

    try {
      const localSettings = localStorage.getItem(storageKey)
      if (localSettings) {
        const parsedSettings = JSON.parse(localSettings)
        await SettingsAPI.updateSettings(parsedSettings)
        console.log('Local settings migrated to server successfully')
      }
    } catch (err) {
      console.error('Failed to migrate local settings to server:', err)
    }
  }

  // Update a single setting
  const updateSetting = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      if (settings.value[parent] && typeof settings.value[parent] === 'object') {
        settings.value[parent][child] = value
      }
    } else {
      settings.value[key] = value
    }
  }

  // Reset settings to defaults
  const resetSettings = () => {
    settings.value = { ...defaultSettings }
  }

  // Auto-save settings when they change
  watch(settings, saveSettings, { deep: true })

  // Auto-load settings when authentication status changes
  watch(isAuthenticated, async (newAuth, oldAuth) => {
    if (newAuth && !oldAuth) {
      // User just logged in, migrate local settings
      await migrateLocalSettingsToServer()
    }
    // Reload settings from appropriate source
    await loadSettings()
  })

  return {
    settings,
    isLoading,
    error,
    isAuthenticated,
    loadSettings,
    saveSettings,
    updateSetting,
    resetSettings,
    migrateLocalSettingsToServer,
  }
}
