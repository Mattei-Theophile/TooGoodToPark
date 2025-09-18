import {createApp} from 'vue'
import App from './App.vue'
import router from "./services/router/router.js";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)




app.mount('#app')