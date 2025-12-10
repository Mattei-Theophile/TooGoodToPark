<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import Logout from '@/components/core/authentification/Logout.vue'

const isLoading = ref(true)

// Toggle states for notifications
const notifications = ref({
  push: true,
  email: false,
})

const accountSettings = [
  { name: 'Profile Information', link: '/account/profile', icon: 'mdi-account-circle-outline' },
  { name: 'Payment Methods', link: '/account/payment', icon: 'mdi-credit-card-outline' },
  {
    name: 'Driving License Details',
    link: '/account/license',
    icon: 'mdi-card-account-details-outline',
  },
]

const securitySettings = [
  { name: 'Change Password', link: '/account/security', icon: 'mdi-lock-outline' },
  { name: 'Two-Factor Authentication', link: '/account/2fa', icon: 'mdi-shield-check-outline' },
  { name: 'Manage Location Data', link: '/account/privacy', icon: 'mdi-map-marker-radius-outline' },
]

const generalSettings = [
  { name: 'Language', link: '/settings/language', icon: 'mdi-translate' },
  { name: 'Theme', link: '/settings/theme', icon: 'mdi-theme-light-dark' },
]

const supportSettings = [
  { name: 'Help Center', link: '/support', icon: 'mdi-help-circle-outline' },
  { name: 'Terms of Service', link: '/terms', icon: 'mdi-file-document-outline' },
  { name: 'Privacy Policy', link: '/privacy', icon: 'mdi-shield-account-outline' },
]

onBeforeMount(async () => {
  try {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  } catch (error) {
    console.error('Failed to fetch user details:', error)
  }
})
</script>

<template>
  <div v-if="isLoading" class="d-flex justify-center align-center py-10">
    <v-progress-circular indeterminate color="#216c37" size="64"></v-progress-circular>
  </div>

  <v-container v-else maxWidth="800" class="pa-0 pa-sm-4">
    <h2 class="text-h4 font-weight-bold mb-6 text-grey-darken-3 px-4">Settings</h2>

    <v-card elevation="1" rounded="lg" class="mb-6">
      <v-list subheader lines="one">
        <v-list-subheader class="text-uppercase font-weight-bold text-caption text-primary"
          >Account</v-list-subheader
        >

        <v-list-item
          v-for="(item, index) in accountSettings"
          :key="index"
          :to="item.link"
          :prepend-icon="item.icon"
          color="#216c37"
          rounded="lg"
          class="mb-1"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <template v-slot:append>
            <v-icon icon="mdi-chevron-right" size="small" color="grey-lighten-1"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card elevation="1" rounded="lg" class="mb-6">
      <v-list subheader lines="one">
        <v-list-subheader class="text-uppercase font-weight-bold text-caption text-primary"
          >Notifications</v-list-subheader
        >

        <v-list-item prepend-icon="mdi-bell-outline">
          <v-list-item-title>Push Notifications</v-list-item-title>
          <template v-slot:append>
            <v-switch
              v-model="notifications.push"
              color="#216c37"
              hide-details
              inset
              density="compact"
            ></v-switch>
          </template>
        </v-list-item>

        <v-list-item prepend-icon="mdi-email-outline">
          <v-list-item-title>Email Notifications</v-list-item-title>
          <template v-slot:append>
            <v-switch
              v-model="notifications.email"
              color="#216c37"
              hide-details
              inset
              density="compact"
            ></v-switch>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card elevation="1" rounded="lg" class="mb-6">
      <v-list subheader lines="one">
        <v-list-subheader class="text-uppercase font-weight-bold text-caption text-primary"
          >Security</v-list-subheader
        >

        <v-list-item
          v-for="(item, index) in securitySettings"
          :key="index"
          :to="item.link"
          :prepend-icon="item.icon"
          rounded="lg"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <template v-slot:append>
            <v-icon icon="mdi-chevron-right" size="small" color="grey-lighten-1"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card elevation="1" rounded="lg" class="mb-6">
      <v-list subheader lines="one">
        <v-list-subheader class="text-uppercase font-weight-bold text-caption text-primary"
          >General</v-list-subheader
        >

        <v-list-item
          v-for="(item, index) in generalSettings"
          :key="index"
          :to="item.link"
          :prepend-icon="item.icon"
          rounded="lg"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <template v-slot:append>
            <v-icon icon="mdi-chevron-right" size="small" color="grey-lighten-1"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card elevation="1" rounded="lg" class="mb-8">
      <v-list subheader lines="one">
        <v-list-subheader class="text-uppercase font-weight-bold text-caption text-primary"
          >Support & Legal</v-list-subheader
        >

        <v-list-item
          v-for="(item, index) in supportSettings"
          :key="index"
          :to="item.link"
          :prepend-icon="item.icon"
          rounded="lg"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <template v-slot:append>
            <v-icon icon="mdi-chevron-right" size="small" color="grey-lighten-1"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <div class="d-flex flex-column align-center justify-center gap-2 mb-10">
      <logout />
      <span class="text-caption text-grey-darken-1 mt-4">App Version 1.0.0</span>
    </div>
  </v-container>
</template>

<style scoped>
/* Vuetify handles most styles.
   We just add a custom color class for the subheaders to match your brand green */
.text-primary {
  color: #216c37 !important;
}
</style>
