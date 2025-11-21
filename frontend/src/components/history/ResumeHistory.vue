<script setup>
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

const reservationService = ref(null)
const isLoading = ref(true)

reservationService.value = new Reservations()

const limitShow = ref(props.defaultLimitShow)

const loadReservations = async () => {
  try {
    await reservationService.value.fetchMyReservation()
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load reservations :', error)
    isLoading.value = true
  }
}

const reservationToShow = computed(() => {
  return reservationService.value.centralizedReservations.slice(0, limitShow.value)
})

const handleSeeAllHistory = () => {
  if (limitShow.value === reservationService.value.centralizedReservations.length) {
    limitShow.value = props.defaultLimitShow
  } else {
    limitShow.value = reservationService.value.centralizedReservations.length
  }
}

onMounted(() => {
  if (useUserStore().isLoggedIn) {
    loadReservations()
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="loading">Loading cars...</div>
  <div v-else>
    <div v-if="!useUserStore().isAuthenticated">
      <p>You must be logged in to see your history</p>
      <button>
        <router-link to="/login">Log in !</router-link>
      </button>
    </div>
    <div v-else-if="isLoading" class="loading">Loading cars...</div>
    <div v-else>
      <reservation-info
        v-for="(reservation, index) in reservationToShow"
        :key="index"
        :reservation="reservation"
      />

      <button class="see-all-history" @click="handleSeeAllHistory">See all history</button>
    </div>
  </div>
</template>

<style scoped>
.see-all-history {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  border-radius: 10px;
  padding: 0.5rem 5rem;
  color: #ffffff;
  font-size: 1.2rem;
}
</style>
