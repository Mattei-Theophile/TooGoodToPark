import {defineStore} from "pinia";

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
    persist: true,

})


