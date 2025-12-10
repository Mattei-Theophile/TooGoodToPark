import { createApp } from 'vue'
import App from './App.vue'
import router from './services/router/router.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import vueCountryRegionSelect from 'vue3-country-region-select'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import { useUserStore } from './stores/UserStore.js'

const app = createApp(App)
const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(vuetify)
app.use(router)
app.use(VueTelInput)
app.use(vueCountryRegionSelect)
const authStore = useUserStore()
await authStore.initializeAuth()

app.mount('#app')
