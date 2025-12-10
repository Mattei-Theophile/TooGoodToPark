<script setup>
import { onBeforeMount, ref } from 'vue'
import ReservationStatistic from '@/components/car/reservationStatistic.vue'
import { User } from '@/services/User.js'
import CarAddButton from '@/components/car/CarAddButton.vue'
import ProfileDetails from '@/components/user/ProfileDetails.vue'
import Logout from '@/components/core/authentification/Logout.vue'

const isLoading = ref(true)
const user = ref(new User())

onBeforeMount(async () => {
  try {
    await user.value.fetchUserDetails()
  } catch (error) {
    console.error('Failed to fetch user details:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <v-container fluid class="bg-grey-lighten-4 pa-6" style="min-height: 100vh">
    <v-overlay :model-value="isLoading" class="align-center justify-center" persistent>
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <div v-if="!isLoading">
      <v-row justify="center">
        <v-col cols="12" md="4" lg="3">
          <v-card elevation="2" class="rounded-lg text-center pa-6">
            <div class="d-flex flex-column align-center">
              <v-avatar color="primary" size="100" class="mb-4 elevation-3">
                <span class="text-h3 font-weight-bold text-white">
                  {{ user.firstName ? user.firstName.charAt(0) : 'U' }}
                </span>
              </v-avatar>

              <h2 class="text-h5 font-weight-bold mb-1">
                {{ user.firstName }} {{ user.lastName }}
              </h2>

              <v-chip
                color="amber-darken-2"
                variant="flat"
                size="small"
                class="mb-6 font-weight-bold"
              >
                <v-icon start icon="mdi-crown"></v-icon>
                Premium
              </v-chip>
            </div>

            <v-divider class="my-4"></v-divider>
          </v-card>
        </v-col>

        <v-col cols="12" md="8" lg="7">
          <v-row>
            <v-col cols="12">
              <v-card elevation="2" class="rounded-lg">
                <v-card-title class="d-flex align-center text-primary py-4 px-6 bg-white">
                  <v-icon icon="mdi-account-details" start class="mr-2"></v-icon>
                  Profile Details
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-6">
                  <profile-details />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-card elevation="2" class="rounded-lg">
                <v-card-title class="d-flex align-center text-primary py-4 px-6 bg-white">
                  <v-icon icon="mdi-chart-bar" start class="mr-2"></v-icon>
                  Reservation Statistics
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-6">
                  <reservation-statistic />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="mt-8 mb-4">
        <v-col cols="12" class="d-flex justify-center">
          <div class="d-flex flex-column justify-center" style="gap: 1rem">
            <car-add-button />
            <logout />
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
/* Optional: specific tweaks */
</style>
