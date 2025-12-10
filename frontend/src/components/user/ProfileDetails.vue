<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { User } from '@/services/User.js'
import PayInformationSave from '@/components/payment/PayInformationSave.vue'
import PasswordChange from '@/components/user/PasswordChange.vue'
import AddLicenseDriver from '@/components/user/AddLicenseDriver.vue'
import UserDetails from '@/components/user/UserDetails.vue'

const isLoading = ref(true)
const user = ref(new User())

// Controls which panel is open (optional, can be removed if you want them all closed initially)
const panel = ref([0])

onBeforeMount(async () => {
  try {
    // Await if fetchUserDetails is async, otherwise just call it
    await user.value.fetchUserDetails()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="d-flex justify-center align-center py-10">
    <v-progress-circular indeterminate color="#216c37" size="64"></v-progress-circular>
  </div>

  <v-container v-else fluid class="pa-0 pa-sm-4">
    <v-expansion-panels v-model="panel" variant="accordion" multiple>
      <v-expansion-panel elevation="2" rounded="lg" class="mb-4">
        <v-expansion-panel-title class="text-h6 font-weight-medium">
          <v-icon icon="mdi-account" class="mr-3" color="#216c37"></v-icon>
          Personal Information
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <UserDetails :user="user" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel elevation="2" rounded="lg" class="mb-4">
        <v-expansion-panel-title class="text-h6 font-weight-medium">
          <v-icon icon="mdi-credit-card" class="mr-3" color="#216c37"></v-icon>
          Payment Methods
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <PayInformationSave />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel elevation="2" rounded="lg" class="mb-4">
        <v-expansion-panel-title class="text-h6 font-weight-medium">
          <v-icon icon="mdi-card-account-details" class="mr-3" color="#216c37"></v-icon>
          Driver's License & Verification
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <add-license-driver />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel elevation="2" rounded="lg" class="mb-4">
        <v-expansion-panel-title class="text-h6 font-weight-medium">
          <v-icon icon="mdi-lock" class="mr-3" color="#216c37"></v-icon>
          Security & Password
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <password-change />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style scoped>
/* Vuetify handles most styles, but you can override specific panel borders here if needed */
</style>
