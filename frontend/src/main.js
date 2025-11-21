import { createApp } from 'vue'
import App from './App.vue'
import router from './services/router/router.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useUserStore } from './stores/UserStore.js'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

const authStore = useUserStore()
await authStore.initializeAuth()

app.mount('#app')
