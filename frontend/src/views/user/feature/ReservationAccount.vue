<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { Reservations } from '@/services/reservations.js'
import ReservationInfo from '@/components/car/reservationInfo.vue'

const isLoading = ref(true)
const activeTab = ref('current')

const reservations = ref()
reservations.value = new Reservations()

onBeforeMount(async () => {
  try {
    await reservations.value.fetchMyReservation()
    isLoading.value = false
  } catch (error) {
    console.error('Failed to fetch reservation information:', error)
  }
})

const currentReservations = computed(() => {
  if (!reservations.value?.centralizedReservations) return []
  const now = new Date()
  return reservations.value.centralizedReservations.filter(
    (r) => r.status === 'active' && new Date(r.end) >= now,
  )
})

const pastReservations = computed(() => {
  if (!reservations.value?.centralizedReservations) return []
  const now = new Date()
  return reservations.value.centralizedReservations.filter(
    (r) => r.status === 'finished' || new Date(r.end) < now,
  )
})
</script>

<template>
  <div v-if="isLoading" class="loading">Loading reservation information...</div>
  <div v-else>
    <h2>My bookings</h2>

    <div class="tabs">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'current' }"
        @click="activeTab = 'current'"
      >
        Current
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'past' }"
        @click="activeTab = 'past'"
      >
        Past
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'current'" class="reservations-list">
        <div v-if="currentReservations.length === 0" class="empty-state">
          No active reservations.
        </div>
        <reservation-info
          v-else
          v-for="reservation in currentReservations"
          :key="reservation.id"
          :reservation="reservation"
        />
      </div>

      <div v-if="activeTab === 'past'" class="reservations-list">
        <div v-if="pastReservations.length === 0" class="empty-state">No past reservations.</div>
        <reservation-info
          v-else
          v-for="reservation in pastReservations"
          :key="reservation.id"
          :reservation="reservation"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 20px;
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  padding: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #888;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #fff;
}

.tab-button.active {
  color: #fff;
  border-bottom-color: #00bcd4;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #888;
}
</style>
