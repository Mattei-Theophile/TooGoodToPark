<script setup>
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import Header from '@/components/core/navigation/Header.vue'
import Footer from '@/components/core/navigation/Footer.vue'
import CookieBanner from '@/components/core/cookies/cookie-banner.vue'
import SidebarAccount from '@/components/core/navigation/SidebarAccount.vue'
import BottomNavMenu from '@/components/core/navigation/BottomNavMenu.vue'
import 'v-calendar/style.css'

const { mobile } = useDisplay()
const drawer = ref(!mobile.value)

watch(mobile, (isMobile) => {
  if (!isMobile) {
    drawer.value = true
  } else {
    drawer.value = false
  }
})

const handleCookieConsent = (consent) => {
  console.log('Cookie consent given:', consent)
}
</script>

<template>
  <v-app>
    <Header v-if="$route.meta.showHeader" @toggle-drawer="drawer = !drawer" />

    <v-app-bar-nav-icon
      v-if="$route.meta.showSidebar && mobile"
      variant="text"
      @click="drawer = !drawer"
      class="top-0 left-0 mt-4 ml-2"
      style="z-index: 900; font-size: 35px"
      size="40"
    ></v-app-bar-nav-icon>

    <SidebarAccount v-model="drawer" v-if="$route.meta.showSidebar" />

    <v-main class="bg-grey-lighten-4">
      <v-container class="pa-0 main-wrapper">
        <router-view />
      </v-container>
    </v-main>

    <div class="navigation-wrapper">
      <BottomNavMenu v-if="!mdAndUp" />
      <Footer v-else />
    </div>

    <CookieBanner @consent-given="handleCookieConsent" />
  </v-app>
</template>

<style scoped>
.main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  min-height: 80vh;
}

@media (max-width: 960px) {
  .main-wrapper {
    max-width: 100%;
  }
}

.navigation-wrapper {
  width: 100%;
}
</style>
