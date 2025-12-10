<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import SearchBar from '@/components/SearchBar.vue'
import { useRouter } from 'vue-router'
import logoImage from '@/assets/logo_TGTP_white.png'

const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
  userStore.logout()
}
</script>

<template>
  <v-app-bar color="#216c37" theme="dark" elevation="2" height="80" class="px-4">
    <div class="d-flex align-center cursor-pointer mr-6" @click="router.push('/')">
      <v-img
        :src="logoImage"
        alt="TooGoodToPark Logo"
        height="50"
        width="50"
        class="mr-3"
        contain
      />
      <h2 class="text-h6 font-weight-bold mb-0 d-sm-block" style="line-height: 1.1">
        TooGood<br />ToPark
      </h2>
    </div>

    <div class="d-none d-md-flex align-center gap-2">
      <v-btn to="/" variant="text" rounded="lg">Home</v-btn>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <div class="mr-4 d-sm-block">
        <search-bar />
      </div>
      <v-menu location="bottom end" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="account-btn ml-2">
            <v-icon size="48">mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list min-width="220" elevation="3" class="rounded-lg py-2">
          <v-list-subheader class="text-uppercase font-weight-bold text-caption">
            Account
          </v-list-subheader>

          <v-list-item to="/account" prepend-icon="mdi-account-cog-outline">
            <v-list-item-title>Profile Settings</v-list-item-title>
          </v-list-item>

          <v-list-item to="/account/reservations" prepend-icon="mdi-history">
            <v-list-item-title>My Reservations</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item
            v-if="!userStore.isLoggedIn()"
            to="/login"
            prepend-icon="mdi-login"
            color="primary"
          >
            <v-list-item-title>Log In</v-list-item-title>
          </v-list-item>

          <v-list-item v-else @click="handleLogout" prepend-icon="mdi-logout" class="text-error">
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.gap-2 {
  gap: 8px;
}
</style>
