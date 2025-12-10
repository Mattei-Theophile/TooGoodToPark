<script setup lang="ts">
import Banner from '@/components/core/banner.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Determine active tab for UI logic (though v-tabs 'to' prop handles routing automatically)
const isLogin = computed(() => route.name === 'Login' || route.path.includes('login'))
</script>

<template>
  <v-container class="fill-height d-flex justify-center align-center" fluid>
    <v-card class="mx-auto" elevation="10" rounded="lg" width="100%" max-width="500">
      <v-card-item class="text-center pt-6 pb-4">
        <v-card-title class="text-h5 font-weight-bold">
          {{ isLogin ? 'Welcome Back' : 'Create Account' }}
        </v-card-title>
        <v-card-subtitle>
          {{ isLogin ? 'Log in to access your services.' : 'Sign up to get started.' }}
        </v-card-subtitle>
      </v-card-item>

      <v-tabs grow color="primary" bg-color="grey-lighten-4">
        <v-tab to="/login" value="login">Login</v-tab>
        <v-tab to="/register" value="register">Registration</v-tab>
      </v-tabs>

      <v-card-text class="pa-6">
        <router-view v-slot="{ Component }">
          <v-slide-x-transition mode="out-in">
            <component :is="Component" />
          </v-slide-x-transition>
        </router-view>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
/* Vuetify handles most styling, minimal overrides needed */
</style>
