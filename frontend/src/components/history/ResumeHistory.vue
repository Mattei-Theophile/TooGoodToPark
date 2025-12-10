<script setup lang="ts">
import ReservationInfo from '@/components/car/reservationInfo.vue'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/UserStore.js'
import { Reservations } from '@/services/reservations.js'

const props = defineProps({
  defaultLimitShow: {
    type: Number,
    default: 3,
  },
})

const userStore = useUserStore()
const reservationService = ref(new Reservations())
const isLoading = ref(true)
const limitShow = ref(props.defaultLimitShow)

const isExpanded = computed(() => {
  return limitShow.value >= reservationService.value.centralizedReservations.length
})

const loadReservations = async () => {
  isLoading.value = true
  try {
    await reservationService.value.fetchMyReservation()
  } catch (error) {
    console.error('Failed to load reservations:', error)
  } finally {
    isLoading.value = false
  }
}

const reservationToShow = computed(() => {
  if (!reservationService.value.centralizedReservations) return []
  return reservationService.value.centralizedReservations.slice(0, limitShow.value)
})

const handleToggleHistory = () => {
  if (isExpanded.value) {
    limitShow.value = props.defaultLimitShow
  } else {
    limitShow.value = reservationService.value.centralizedReservations.length
  }
}

onMounted(() => {
  if (userStore.isLoggedIn()) {
    loadReservations()
  } else {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="d-flex flex-column fill-height">
    <div v-if="isLoading" class="d-flex justify-center align-center py-8">
      <v-progress-circular indeterminate color="#216c37" size="64" width="6"></v-progress-circular>
    </div>

    <div v-else class="d-flex flex-column ga-4">
      <v-sheet
        v-if="!userStore.isLoggedIn()"
        class="d-flex flex-column align-center justify-center pa-6 text-center"
        rounded="lg"
        border="dashed"
      >
        <v-icon icon="mdi-lock" size="48" color="grey-lighten-1" class="mb-2"></v-icon>
        <p class="text-body-1 mb-4 text-medium-emphasis">
          Please log in to view your reservation history.
        </p>
        <v-btn
          to="/login"
          color="#216c37"
          theme="dark"
          prepend-icon="mdi-login"
          width="100%"
          max-width="300"
        >
          Log in
        </v-btn>
      </v-sheet>

      <v-sheet
        v-else-if="reservationService.centralizedReservations.length === 0"
        class="d-flex flex-column align-center justify-center pa-8 text-center"
        rounded="lg"
        border="dashed"
        color="grey-lighten-5"
      >
        <v-icon icon="mdi-car-key" size="54" color="grey" class="mb-3"></v-icon>

        <h3 class="text-h6 font-weight-bold text-grey-darken-2">No trips yet</h3>

        <p class="text-body-2 mb-6 text-medium-emphasis" style="max-width: 250px">
          Ready to hit the road? Find the perfect car for your next adventure.
        </p>

        <v-btn
          to="/search"
          color="#216c37"
          theme="dark"
          prepend-icon="mdi-magnify"
          elevation="2"
          width="100%"
          max-width="250"
        >
          Rent a car
        </v-btn>
      </v-sheet>

      <div v-else class="d-flex flex-column ga-4">
        <v-slide-y-transition group>
          <reservation-info
            v-for="(reservation, index) in reservationToShow"
            :key="reservation.id || index"
            :reservation="reservation"
          />
        </v-slide-y-transition>

        <v-btn
          v-if="reservationService.centralizedReservations.length > props.defaultLimitShow"
          @click="handleToggleHistory"
          color="#216c37"
          theme="dark"
          size="large"
          class="text-none mt-2 align-self-center"
          width="80%"
          rounded="lg"
          elevation="2"
          :prepend-icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        >
          {{ isExpanded ? 'Show less' : 'See all history' }}
        </v-btn>
      </div>
    </div>
  </div>
</template>
