import { defineStore } from 'pinia'

export const settingsStore = defineStore('settingStore', {
  state: () => ({
    theme: 'light',
    language: 'fr',
    fontSize: 'medium',
    imageQuality: 'high',
    compressionLevel: 80,
    dataCollection: false,
    cookies: ['essential'],
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme
    },
    setLanguage(language) {
      this.language = language
    },
    setFontSize(fontSize) {
      this.fontSize = fontSize
    },
    setImageQuality(imageQuality) {},
  },
  persist: true,
})
