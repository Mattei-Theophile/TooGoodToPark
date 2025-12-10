<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { Reservations } from '@/services/reservations.js'
import ReservationInfo from '@/components/car/reservationInfo.vue'

const isLoading = ref(true)
const activeTab = ref('current')
const searchQuery = ref('')
const sortBy = ref('date')
const filterStatus = ref('all')

const reservations = ref()
reservations.value = new Reservations()

onBeforeMount(async () => {
  try {
    await reservations.value.fetchMyReservation()
    isLoading.value = false
  } catch (error) {
    console.error('Failed to fetch reservation information:', error)
    isLoading.value = false
  }
})

const currentReservations = computed(() => {
  if (!reservations.value?.centralizedReservations) return []
  const now = new Date()
  return reservations.value.centralizedReservations.filter((r) => {
    return new Date(r.end) >= now && r.status !== 'cancelled' && r.status !== 'finished'
  })
})

const pastReservations = computed(() => {
  if (!reservations.value?.centralizedReservations) return []
  const now = new Date()
  return reservations.value.centralizedReservations.filter(
    (r) => r.status === 'finished' || new Date(r.end) < now,
  )
})

const totalReservations = computed(() => {
  return reservations.value?.centralizedReservations?.length || 0
})

const upcomingCount = computed(() => currentReservations.value.length)
const completedCount = computed(() => pastReservations.value.length)

// Filter and sort reservations
const filteredReservations = computed(() => {
  let list = activeTab.value === 'current' ? currentReservations.value : pastReservations.value

  // Apply search filter
  if (searchQuery.value) {
    list = list.filter(
      (r) =>
        r.car?.brand?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        r.car?.model?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        r.id?.toString().includes(searchQuery.value),
    )
  }

  // Apply sorting
  if (sortBy.value === 'date') {
    list = [...list].sort((a, b) => new Date(b.start) - new Date(a.start))
  } else if (sortBy.value === 'price') {
    list = [...list].sort((a, b) => b.price - a.price)
  }

  return list
})

const stats = computed(() => [
  {
    title: 'Total Bookings',
    value: totalReservations.value,
    icon: 'mdi-calendar-multiple',
    color: 'blue',
  },
  {
    title: 'Active',
    value: upcomingCount.value,
    icon: 'mdi-car-clock',
    color: 'green',
  },
  {
    title: 'Completed',
    value: completedCount.value,
    icon: 'mdi-check-circle',
    color: 'grey',
  },
])
</script>

<template>
  <v-container fluid class="reservations-page">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <div class="page-header">
          <div>
            <h1 class="text-h3 font-weight-bold d-flex align-center">
              <v-icon color="green-darken-3" size="large" class="mr-3"> mdi-calendar-clock </v-icon>
              My Bookings
            </h1>
            <p class="text-body-1 text-grey-darken-1 mt-2 ml-12">
              Manage and track all your car reservations
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="isLoading" justify="center" class="loading-container">
      <v-col cols="auto" class="text-center py-12">
        <v-progress-circular indeterminate color="green-darken-3" size="64" width="6" />
        <p class="text-h6 mt-4">Loading your reservations...</p>
      </v-col>
    </v-row>

    <!-- Content -->
    <div v-else>
      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="4">
          <v-card class="stat-card" elevation="3">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar :color="stat.color" size="56" class="mr-4">
                  <v-icon size="large" color="white">{{ stat.icon }}</v-icon>
                </v-avatar>
                <div>
                  <p class="text-caption text-grey-darken-1 mb-1">{{ stat.title }}</p>
                  <h3 class="text-h4 font-weight-bold">{{ stat.value }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="mb-4 filters-card" elevation="2">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search by car brand, model or booking ID"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="sortBy"
                :items="[
                  { title: 'Sort by Date', value: 'date' },
                  { title: 'Sort by Price', value: 'price' },
                ]"
                label="Sort By"
                variant="outlined"
                density="comfortable"
                hide-details
                prepend-inner-icon="mdi-sort"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-chip-group v-model="activeTab" mandatory selected-class="text-green-darken-3">
                <v-chip value="current" filter variant="outlined">
                  <v-icon start>mdi-clock-outline</v-icon>
                  Active ({{ upcomingCount }})
                </v-chip>
                <v-chip value="past" filter variant="outlined">
                  <v-icon start>mdi-history</v-icon>
                  Past ({{ completedCount }})
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tabs -->
      <v-tabs v-model="activeTab" color="green-darken-3" align-tabs="center" class="mb-4">
        <v-tab value="current">
          <v-icon start>mdi-calendar-clock</v-icon>
          Current Bookings
          <v-badge
            v-if="upcomingCount > 0"
            :content="upcomingCount"
            color="green-darken-3"
            inline
            class="ml-2"
          />
        </v-tab>
        <v-tab value="past">
          <v-icon start>mdi-history</v-icon>
          Past Bookings
          <v-badge
            v-if="completedCount > 0"
            :content="completedCount"
            color="grey"
            inline
            class="ml-2"
          />
        </v-tab>
      </v-tabs>

      <!-- Tab Content -->
      <v-window v-model="activeTab">
        <!-- Current Reservations -->
        <v-window-item value="current">
          <v-row v-if="filteredReservations.length === 0">
            <v-col>
              <v-card class="empty-state-card" elevation="2">
                <v-card-text class="text-center py-12">
                  <v-icon size="80" color="grey-lighten-1" class="mb-4">
                    mdi-calendar-remove
                  </v-icon>
                  <h3 class="text-h5 mb-3">No Active Reservations</h3>
                  <p class="text-body-1 text-grey-darken-1 mb-6">
                    You don't have any active bookings at the moment.
                    <br />
                    Ready to hit the road?
                  </p>
                  <v-btn
                    color="green-darken-3"
                    size="large"
                    prepend-icon="mdi-magnify"
                    to="/search"
                  >
                    Browse Available Cars
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col v-for="reservation in filteredReservations" :key="reservation.id" cols="12">
              <div class="reservation-item">
                <reservation-info :reservation="reservation" />
              </div>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Past Reservations -->
        <v-window-item value="past">
          <v-row v-if="filteredReservations.length === 0">
            <v-col>
              <v-card class="empty-state-card" elevation="2">
                <v-card-text class="text-center py-12">
                  <v-icon size="80" color="grey-lighten-1" class="mb-4"> mdi-history </v-icon>
                  <h3 class="text-h5 mb-3">No Past Reservations</h3>
                  <p class="text-body-1 text-grey-darken-1 mb-6">
                    You haven't completed any bookings yet.
                    <br />
                    Your rental history will appear here once you've finished a reservation.
                  </p>
                  <v-btn color="green-darken-3" size="large" prepend-icon="mdi-car" to="/search">
                    Start Your First Booking
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col v-for="reservation in filteredReservations" :key="reservation.id" cols="12">
              <div class="reservation-item">
                <reservation-info :reservation="reservation" />
              </div>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<style scoped>
.reservations-page {
  max-width: 1400px;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.loading-container {
  min-height: 400px;
}

.stat-card {
  border-radius: 16px !important;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.filters-card {
  border-radius: 16px !important;
}

.empty-state-card {
  border-radius: 16px !important;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.reservation-item {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tab styling */
:deep(.v-tabs) {
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

:deep(.v-tab) {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Responsive */
@media (max-width: 960px) {
  .reservations-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
