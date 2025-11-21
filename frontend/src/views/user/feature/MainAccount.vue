<script setup>
import { onBeforeMount, ref } from 'vue'
import ReservationStatistic from '@/components/car/reservationStatistic.vue'
import { User } from '@/services/User.js'

const isLoading = ref(true)

const user = ref()
user.value = new User()

const categoryDetails = [
  { name: 'Personal Information', link: '' },
  { name: 'Payment Methods', link: '' },
  { name: "Driver's License & Verification", link: '' },
  { name: 'Notifications Settings', link: '' },
  { name: 'Security & Password', link: '' },
]

onBeforeMount(async () => {
  try {
    await user.value.fetchUserDetails()
    isLoading.value = false
  } catch (error) {
    console.error('Failed to fetch user details:', error)
  }
})
</script>

<template>
  <div v-if="isLoading" class="loading">Loading account information...</div>
  <div v-else>
    <div>
      <div class="Avatar">
        <div class="avatar-container"></div>

        <div class="name-container">
          <h2>{{ user.firstName + ' ' + user.lastName }}</h2>
        </div>

        <div class="role-container">
          <p>Premium</p>
        </div>
      </div>

      <h2>Profile Details</h2>

      <div class="profile-details" v-for="category in categoryDetails">
        <p>{{ category.name }}</p>

        <router-link :to="category.link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-chevron-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </router-link>
      </div>
    </div>
    <h2>Reservation Statistics</h2>
    <reservation-statistic />

    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        class="bi bi-plus-circle-fill"
        viewBox="0 0 16 16"
      >
        <path
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"
        />
      </svg>

      <p>List Your Car</p>
    </div>
  </div>
</template>

<style scoped>
.Avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    margin: 0.5rem;
  }
}

.profile-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
