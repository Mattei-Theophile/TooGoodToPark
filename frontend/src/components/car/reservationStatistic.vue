<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/UserStore.js'
import { ReservationStatistic } from '@/services/reservationStatistic.js'

const isLoading = ref(true)
const reservationService = ref(null)

const reservationStatistic = ref(null)
reservationService.value = new ReservationStatistic()

const loadReservations = async () => {
  try {
    reservationStatistic.value = await reservationService.value.fetchMyStatisticReservation()
    console.log(reservationStatistic.value)
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load reservations :', error)
  }
}

onMounted(() => {
  if (useUserStore().isAuthenticated) {
    loadReservations()
  }
})
</script>

<template>
  <div v-if="isLoading" class="loading">Loading statistics information...</div>
  <div v-else class="reservation-container">
    <div class="data-reservation-container">
      <div class="title-reservation-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-car-front-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"
          />
        </svg>
        <h2>{{ reservationStatistic.statistics.totalReservations }}</h2>
      </div>
      <p>Total Trips</p>
    </div>

    <div class="data-reservation-container">
      <div class="title-reservation-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-map"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.8V1.11l-4 .8v12.98z"
          />
        </svg>
        <h2>{{ reservationStatistic.statistics.longestRentalDays }}</h2>
      </div>

      <p>longest rental days</p>
    </div>

    <div class="data-reservation-container">
      <div class="title-reservation-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-cash-stack"
          viewBox="0 0 16 16"
        >
          <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
          <path
            d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"
          />
        </svg>
        <h2>{{ reservationStatistic.statistics.totalSpent }}</h2>
      </div>
      <p>Total Spent</p>
    </div>

    <div class="data-reservation-container">
      <div class="title-reservation-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-star-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
          />
        </svg>
        <h2>{{ reservationStatistic.statistics.averageBookingValue }}</h2>
      </div>
      <p>Average Rating</p>
    </div>
  </div>
</template>

<style scoped>
.reservation-container {
  display: flex;
  flex-flow: row wrap;
}

.data-reservation-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 200px;

  h2 {
    margin: 0;
  }
  p {
    font-size: 12px;
  }
}

.title-reservation-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
